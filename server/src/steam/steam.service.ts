import {BadRequestException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PrismaService} from '../prisma/prisma.service';
import {SyncSteamDto} from './dto/sync-steam.dto';

export interface SteamGetOwnedGamesResponse {
  response: {
    game_count?: number;
    games?: Array<{
      appid: number;
      name: string;
      playtime_forever: number;
      img_icon_url: string;
    }>;
  };
}

@Injectable()
export class SteamService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async fetchUserGames(steamId: string) {
    const url = new URL(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
    );

    const STEAM_API_KEY: string =
      this.configService.getOrThrow('STEAM_API_KEY');

    url.searchParams.append('key', STEAM_API_KEY);
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
}
