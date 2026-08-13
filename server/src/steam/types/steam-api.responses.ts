export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
  rtime_last_played?: number;
}

export interface SteamGetOwnedGamesResponse {
  response: {
    game_count?: number;
    games?: SteamGame[];
  };
}

export interface SteamAchievement {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  description?: string;
  icon: string;
  icongray: string;
}

export interface SteamGameSchemaResponse {
  game: {
    gameName?: string;
    gameVersion?: string;
    availableGameStats?: {
      achievements?: SteamAchievement[];
    };
  };
}

export interface SteamUserAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

export interface SteamPlayerAchievementsResponse {
  playerstats?: {
    steamID?: string;
    gameName?: string;
    achievements?: SteamUserAchievement[];
    success?: boolean;
    error?: string;
  };
}

export interface SteamGlobalAchievementItem {
  name: string;
  percent: number;
}

export interface SteamGlobalAchievementsResponse {
  achievementpercentages?: {
    achievements?: SteamGlobalAchievementItem[];
  };
}
