import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SyncSteamDto } from './dto/sync-steam.dto';
import type {
  CompletionStatus,
  ProgressCalculationResult,
  SyncedGamesResponse,
} from './types/steam.types';
import type {
  SteamGame,
  SteamGameSchemaResponse,
  SteamGetOwnedGamesResponse,
  SteamPlayerAchievementsResponse,
} from './types/steam-api.responses';

@Injectable()
export class SteamService {
  private readonly logger = new Logger(SteamService.name);
  private readonly STEAM_API_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.STEAM_API_KEY = configService.getOrThrow('STEAM_API_KEY');
  }

  private async calculateGameProgress(
    userId: string,
    gameId: string,
  ): Promise<ProgressCalculationResult> {
    const [totalAchievements, unlockedAchievements] = await Promise.all([
      this.prisma.achievement.count({ where: { gameId } }),
      this.prisma.userAchievement.count({
        where: { userId, achievement: { gameId } },
      }),
    ]);

    if (totalAchievements === 0) {
      return { completionPercent: 0, status: 'backlog' };
    }

    const rawPercent = (unlockedAchievements / totalAchievements) * 100;
    const completionPercent = Math.round(rawPercent * 10) / 10;

    let status: CompletionStatus = 'backlog';
    if (completionPercent === 100) status = 'completed';
    else if (completionPercent > 0) status = 'playing';

    return { completionPercent, status };
  }

  private async fetchUserGames(
    steamId: string,
  ): Promise<SteamGetOwnedGamesResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('steamid', steamId);
      url.searchParams.append('include_appinfo', 'true');

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamGetOwnedGamesResponse;
    } catch (error) {
      this.logger.error(
        `Error fetching user games for SteamID ${steamId}: ${error}`,
      );
      return null;
    }
  }

  private async fetchGameSchema(
    appId: number,
  ): Promise<SteamGameSchemaResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('appid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamGameSchemaResponse;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch game schema for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  private async fetchUserAchievements(
    steamId: string,
    appId: number,
  ): Promise<SteamPlayerAchievementsResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('steamid', steamId);
      url.searchParams.append('appid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamPlayerAchievementsResponse;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch player achievements for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  private async saveGameAchievements(
    gameId: string,
    appId: number,
  ): Promise<void> {
    try {
      const gameSchema = await this.fetchGameSchema(appId);

      if (!gameSchema) return;

      const achievements = gameSchema.game?.availableGameStats?.achievements;

      if (!achievements || achievements.length === 0) return;

      await this.prisma.achievement.createMany({
        data: achievements.map((achievement) => ({
          gameId,
          apiname: achievement.name,
          name: achievement.displayName,
          description: achievement.description || null,
          iconUrl: achievement.icon,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      this.logger.error(
        `Failed to save achievements for gameId ${gameId} (appId: ${appId}): ${error}`,
      );
    }
  }

  private async saveUserAchievements(
    userId: string,
    steamId: string,
    gameId: string,
    appId: number,
  ): Promise<void> {
    try {
      const playerAchievementsData = await this.fetchUserAchievements(
        steamId,
        appId,
      );

      if (!playerAchievementsData) return;

      const unlockedAchievements =
        playerAchievementsData.playerstats?.achievements?.filter(
          (achievement) => achievement.achieved === 1,
        );

      if (!unlockedAchievements || unlockedAchievements.length === 0) return;

      const achievementApiNames = unlockedAchievements.map(
        (achievement) => achievement.apiname,
      );

      const dbAchievements = await this.prisma.achievement.findMany({
        where: {
          gameId,
          apiname: { in: achievementApiNames },
        },
        select: {
          id: true,
          apiname: true,
        },
      });

      const achievementMap = new Map(
        dbAchievements.map((achievement) => [
          achievement.apiname,
          achievement.id,
        ]),
      );

      const validUnlockedAchievements = unlockedAchievements.filter(
        (achievement) => achievementMap.has(achievement.apiname),
      );

      const userAchievementsToCreate = validUnlockedAchievements.map(
        (achievement) => ({
          userId,
          achievementId: achievementMap.get(achievement.apiname)!,
          unlockedAt: new Date(achievement.unlocktime * 1000),
        }),
      );

      if (userAchievementsToCreate.length > 0) {
        await this.prisma.userAchievement.createMany({
          data: userAchievementsToCreate,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to save achievements for user ${userId}: ${error}`,
      );
    }
  }

  private async syncSingleGame(
    game: SteamGame,
    userId: string,
    steamId: string,
  ): Promise<void> {
    try {
      const savedGame = await this.prisma.game.upsert({
        where: { steamAppId: game.appid },
        update: {
          name: game.name,
        },
        create: {
          steamAppId: game.appid,
          name: game.name,
          coverUrl: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
        },
      });

      await this.saveGameAchievements(savedGame.id, game.appid);
      await this.saveUserAchievements(
        userId,
        steamId,
        savedGame.id,
        game.appid,
      );

      const progress = await this.calculateGameProgress(userId, savedGame.id);

      const lastPlayed = game.rtime_last_played
        ? new Date(game.rtime_last_played * 1000)
        : null;

      await this.prisma.userGame.upsert({
        where: {
          userId_gameId: {
            userId,
            gameId: savedGame.id,
          },
        },
        update: {
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: lastPlayed,
          completionPercent: progress.completionPercent,
          status: progress.status,
        },
        create: {
          userId,
          gameId: savedGame.id,
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: lastPlayed,
          completionPercent: progress.completionPercent,
          status: progress.status,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to sync single game appId ${game.appid} for user ${userId}: ${error}`,
      );
    }
  }

  public async syncUserGames(
    userId: string,
    dto: SyncSteamDto,
  ): Promise<SyncedGamesResponse> {
    const { steamId } = dto;

    try {
      const steamResponse = await this.fetchUserGames(steamId);

      const games = steamResponse?.response?.games;

      if (!games) {
        throw new BadRequestException('Unable to retrieve games from Steam');
      }

      for (const game of games) {
        await this.syncSingleGame(game, userId, steamId);
      }

      return { synced: games.length };
    } catch (error) {
      this.logger.error(`User sync failed for userId ${userId}:`, error);
      throw new BadRequestException('Steam synchronization failed');
    }
  }
}
