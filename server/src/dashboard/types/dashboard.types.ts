import { CompletionStatus } from '@prisma/client';

export interface UserStatsResponse {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

export interface GameItem {
  game: {
    name: string;
    coverUrl: string | null;
  };
  completionPercent: number;
  playtimeMinutes: number;
  lastPlayedAt: Date | null;
}

export interface NearCompletionGameItem {
  gameId: string;
  completionPercent: number;
  game: {
    name: string;
    coverUrl: string | null;
  };
  remainingAchievements: number;
}

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
