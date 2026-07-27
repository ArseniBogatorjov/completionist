import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SyncSteamDto } from './dto/sync-steam.dto';
import type {
  SteamGameSchemaResponse,
  SteamGetOwnedGamesResponse,
} from './types/steam.interface';

@Injectable()
export class SteamService {
  private readonly STEAM_API_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.STEAM_API_KEY = configService.getOrThrow('STEAM_API_KEY');
  }

  async fetchUserGames(steamId: string) {
    const url = new URL(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
    );

    url.searchParams.append('key', this.STEAM_API_KEY);
    url.searchParams.append('steamid', steamId);
    url.searchParams.append('include_appinfo', 'true');

    const response = await fetch(url);

    if (!response.ok) {
      throw new BadRequestException('Error fetching Steam API');
    }

    const data = (await response.json()) as SteamGetOwnedGamesResponse;

    return data;
  }

  async syncUserGames(userId: string, dto: SyncSteamDto) {
    const { steamId } = dto;

    const steamData = await this.fetchUserGames(steamId);

    const games = steamData.response?.games;
    if (!games) return { synced: 0 };

    for (const game of games) {
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
    }

    return { synced: games.length };
  }

  async fetchGameSchema(appId: number) {
    const url = new URL(
      'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/',
    );
    url.searchParams.append('key', this.STEAM_API_KEY);
    url.searchParams.append('appid', appId.toString());

    const response = await fetch(url);

    if (!response.ok) throw new BadRequestException('Error fetching Steam API');

    const data = (await response.json()) as SteamGameSchemaResponse;

    return data;
  }
}
