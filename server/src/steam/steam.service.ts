import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  constructor(private configService: ConfigService) {}

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
}
