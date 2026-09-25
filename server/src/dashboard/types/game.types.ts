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
  game: {
    id: string;
    name: string;
    coverUrl: string | null;
  };
  remainingAchievements: number;
  completionPercent: number;
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
