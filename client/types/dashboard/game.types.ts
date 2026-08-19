import { Achievement } from '@/types/dashboard/achievement.types';

export interface Game {
  name: string;
  coverUrl: string | null;
  achievements: Achievement[];
}

export interface GameDetails {
  playtimeMinutes: number;
  status: CompletionStatus;
  completionPercent: number;
  game: Game;
}

export interface GameInProgress {
  game: {
    id: string;
    name: string;
    coverUrl: string;
  };
  completionPercent: number;
  playtimeMinutes: number;
  lastPlayedAt: number;
}

export type CompletionStatus = 'backlog' | 'playing' | 'completed';
