export interface GameDetails {
  playtimeMinutes: number;
  status: CompletionStatus;
  completionPercent: number;
  game: {
    name: string;
    coverUrl: string | null;
    achievements: Achievement[];
  };
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

export interface UserAchievement {
  unlockedAt: string;
}

export type CompletionStatus = 'backlog' | 'playing' | 'completed';
