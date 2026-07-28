export interface SteamGameSchemaResponse {
  game: {
    gameName?: string;
    gameVersion?: string;
    availableGameStats?: {
      achievements?: Array<{
        name: string;
        defaultvalue: number;
        displayName: string;
        hidden: number;
        description?: string;
        icon: string;
        icongray: string;
      }>;
    };
  };
}

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

export interface SteamPlayerAchievementsResponse {
  playerstats?: {
    steamID?: string;
    gameName?: string;
    achievements?: Array<{
      apiname: string;
      achieved: number; // 1 = выбита, 0 = не выбита
      unlocktime: number; // Unix timestamp
    }>;
    success?: boolean;
    error?: string;
  };
}
