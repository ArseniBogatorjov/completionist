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
