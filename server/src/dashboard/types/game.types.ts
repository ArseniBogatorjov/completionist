import type { CompletionStatus } from '@prisma/client';
import type { Achievement } from './achievement.types';

export interface Game {
  game: {
    name: string;
    coverUrl: string | null;
  };
  completionPercent: number;
  playtimeMinutes: number;
  lastPlayedAt: Date | null;
}

export interface NearCompletionGame {
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
