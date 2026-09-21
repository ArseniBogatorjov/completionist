import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SyncSteamDto } from './dto/sync-steam.dto';
import { ProgressCalculationObject } from './types/steam.types';
import type {
  SteamAchievement,
  SteamGame,
  SteamGameSchemaResponse,
  SteamGetOwnedGamesResponse,
  SteamGlobalAchievementsResponse,
  SteamPlayerAchievementsResponse,
} from './types/steam-api.responses';
import { setTimeout as sleep } from 'node:timers/promises';
import { ScavengerService } from '../scavenger/scavenger.service';

@Injectable()
export class SteamService {
  private readonly logger = new Logger(SteamService.name);
  private readonly STEAM_API_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly scavengerService: ScavengerService,
  ) {
    this.STEAM_API_KEY = configService.getOrThrow('STEAM_API_KEY');
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

      if (!response.ok) {
        this.logger.error(`Steam API returned status: ${response.status}`);
        return null;
      }

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

  private async fetchGlobalAchievementPercentages(
    appId: number,
  ): Promise<SteamGlobalAchievementsResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/',
      );

      url.searchParams.append('gameid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamGlobalAchievementsResponse;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch global percentages for appId ${appId}: ${error}`,
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
    achievements: SteamAchievement[],
  ): Promise<number> {
    try {
      const globalPercentagesData =
        await this.fetchGlobalAchievementPercentages(appId);

      const rarityMap = new Map<string, number>();
      const globalList =
        globalPercentagesData?.achievementpercentages?.achievements;

      if (globalList) {
        for (const item of globalList) {
          rarityMap.set(item.name, Number(item.percent));
        }
      }

      await this.prisma.achievement.createMany({
        data: achievements.map((achievement) => ({
          gameId,
          apiname: achievement.name,
          name: achievement.displayName,
          description: achievement.description || null,
          iconUrl: achievement.icon,
          globalRarity: rarityMap.get(achievement.name) ?? null,
        })),
        skipDuplicates: true,
      });

      return achievements.length;
    } catch (error) {
      this.logger.error(
        `Failed to save achievements for gameId ${gameId} (appId: ${appId}): ${error}`,
      );
      throw error;
    }
  }

  private async saveUserAchievements(
    userId: string,
    steamId: string,
    gameId: string,
    appId: number,
  ): Promise<number> {
    try {
      const playerAchievementsData = await this.fetchUserAchievements(
        steamId,
        appId,
      );

      if (!playerAchievementsData) return 0;

      const unlockedAchievements =
        playerAchievementsData.playerstats?.achievements?.filter(
          (achievement) => achievement.achieved === 1,
        );

      if (!unlockedAchievements || unlockedAchievements.length === 0) return 0;

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

      return userAchievementsToCreate.length;
    } catch (error) {
      this.logger.error(
        `Failed to save achievements for user ${userId}: ${error}`,
      );
      throw error;
    }
  }

  private async syncSingleGame(
    game: SteamGame,
    userId: string,
    steamId: string,
    existingGamesMap: Map<number, string>,
  ): Promise<void> {
    try {
      const gameSchema = await this.fetchGameSchema(game.appid);
      const achievements = gameSchema?.game?.availableGameStats?.achievements;

      if (!achievements || achievements.length === 0) {
        return;
      }

      let gameId = existingGamesMap.get(game.appid);

      if (!gameId) {
        const savedGame = await this.prisma.game.upsert({
          where: { steamAppId: game.appid },
          update: { name: game.name },
          create: {
            steamAppId: game.appid,
            name: game.name,
            coverUrl: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
          },
        });

        gameId = savedGame.id;
      }

      const totalAchievements = await this.saveGameAchievements(
        gameId,
        game.appid,
        achievements,
      );

      await this.scavengerService.updateMissableAchievements(
        gameId,
        game.appid,
      );

      const unlockedAchievements = await this.saveUserAchievements(
        userId,
        steamId,
        gameId,
        game.appid,
      );

      let progressObject: ProgressCalculationObject = {
        completionPercent: 0,
        status: 'backlog',
      };

      if (totalAchievements > 0) {
        const progress =
          Math.round((unlockedAchievements / totalAchievements) * 100 * 10) /
          10;

        if (progress === 100) {
          progressObject = {
            completionPercent: progress,
            status: 'completed',
          };
        } else if (progress > 0) {
          progressObject = {
            completionPercent: progress,
            status: 'playing',
          };
        }
      }

      const lastPlayed = game.rtime_last_played
        ? new Date(game.rtime_last_played * 1000)
        : null;

      await this.prisma.userGame.upsert({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
        update: {
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: lastPlayed,
          completionPercent: progressObject.completionPercent,
          status: progressObject.status,
        },
        create: {
          userId,
          gameId,
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: lastPlayed,
          completionPercent: progressObject.completionPercent,
          status: progressObject.status,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to sync single game appId ${game.appid} for user ${userId}: ${error}`,
      );
    }
  }

  public async syncUserGames(userId: string, dto: SyncSteamDto): Promise<void> {
    const { steamId } = dto;

    try {
      const steamResponse = await this.fetchUserGames(steamId);

      const games = steamResponse?.response?.games;

      if (!games) {
        throw new BadRequestException('Unable to retrieve games from Steam');
      }

      const filteredGames = games.filter((game) => game.playtime_forever > 0);

      const existingGames = await this.prisma.game.findMany({
        where: {
          steamAppId: { in: filteredGames.map((game) => game.appid) },
        },
        select: { id: true, steamAppId: true },
      });

      const existingGamesMap = new Map<number, string>(
        existingGames.map((g) => [g.steamAppId, g.id]),
      );

      const gameChunks: SteamGame[][] = [];

      for (let i = 0; i < filteredGames.length; i += 3) {
        gameChunks.push(filteredGames.slice(i, i + 3));
      }

      for (const chunk of gameChunks) {
        await sleep(500);
        await Promise.all(
          chunk.map((game) =>
            this.syncSingleGame(game, userId, steamId, existingGamesMap),
          ),
        );
      }
    } catch (error) {
      this.logger.error(`User sync failed for userId ${userId}:`, error);
      throw new BadRequestException('Steam synchronization failed');
    }
  }
}
