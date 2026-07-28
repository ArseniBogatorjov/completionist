import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SyncSteamDto } from './dto/sync-steam.dto';
import {
  SteamGame,
  SteamGameSchemaResponse,
  SteamGetOwnedGamesResponse,
  SteamPlayerAchievementsResponse,
} from './types/steam.interface';

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

  private async fetchUserGames(steamId: string) {
    try {
      const url = new URL(
        'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('steamid', steamId);
      url.searchParams.append('include_appinfo', 'true');

      const response = await fetch(url);

      if (!response.ok) return null;

      const data = (await response.json()) as SteamGetOwnedGamesResponse;

      return data;
    } catch (error) {
      this.logger.error(
        `Error fetching user games for SteamID ${steamId}: ${error}`,
      );
      return null;
    }
  }

  private async fetchGameSchema(appId: number) {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('appid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      const data = (await response.json()) as SteamGameSchemaResponse;

      return data;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch game schema for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  private async fetchUserAchievements(steamId: string, appId: number) {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('steamid', steamId);
      url.searchParams.append('appid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      const data = (await response.json()) as SteamPlayerAchievementsResponse;

      return data;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch player achievements for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  private async saveGameAchievements(gameId: string, appId: number) {
    try {
      const schema = await this.fetchGameSchema(appId);

      if (!schema) return;

      const achievements = schema.game?.availableGameStats?.achievements;

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

  private async syncSingleGame(game: SteamGame, userId: string) {
    try {
      const dbGame = await this.prisma.game.upsert({
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

      await this.prisma.userGame.upsert({
        where: {
          userId_gameId: {
            userId,
            gameId: dbGame.id,
          },
        },
        update: {
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: new Date(),
        },
        create: {
          userId,
          gameId: dbGame.id,
          playtimeMinutes: game.playtime_forever,
        },
      });

      await this.saveGameAchievements(dbGame.id, game.appid);
    } catch (error) {
      this.logger.error(
        `Failed to sync single game appId ${game.appid} for user ${userId}: ${error}`,
      );
    }
  }

  async syncUserGames(userId: string, dto: SyncSteamDto) {
    const { steamId } = dto;

    try {
      const steamData = await this.fetchUserGames(steamId);

      const games = steamData?.response?.games;

      if (!games) {
        throw new BadRequestException('Unable to retrieve games from Steam');
      }

      await Promise.all(games.map((game) => this.syncSingleGame(game, userId)));

      return { synced: games.length };
    } catch (error) {
      this.logger.error(`User sync failed for userId ${userId}:`, error);
      throw new BadRequestException('Steam synchronization failed');
    }
  }
}
