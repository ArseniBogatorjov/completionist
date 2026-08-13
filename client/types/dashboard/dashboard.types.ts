export interface GameDetails {
  playtimeMinutes: number;
  status: CompletionStatus;
  completionPercent: number;
  game: Game;
}

export interface Game {
  name: string;
  coverUrl: string | null;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string;
  globalRarity: number | null;
  isMissable: boolean;
  userAchievements: UserAchievement[];
}

export interface PlayingGame {
  game: {
    id: string;
    name: string;
    coverUrl: string;
  };
  completionPercent: number;
  playtimeMinutes: number;
  lastPlayedAt: number;
}

export interface UserAchievement {
  unlockedAt: string;
}

export type CompletionStatus = 'backlog' | 'playing' | 'completed';
