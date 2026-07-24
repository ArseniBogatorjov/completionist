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
export declare class SteamService {
    private configService;
    constructor(configService: ConfigService);
    fetchUserGames(steamId: string): Promise<SteamGetOwnedGamesResponse>;
}
