import { SteamService } from './steam.service';
export declare class SteamController {
    private readonly steamService;
    constructor(steamService: SteamService);
    fetchUserGames(steamId: string): Promise<import("./steam.service").SteamGetOwnedGamesResponse>;
}
