export interface UserStatsResponse {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

export interface GameInProgressItem {
  game: {
    name: string;
    coverUrl: string | null;
  };
  completionPercent: number;
  playtimeMinutes: number;
  lastPlayedAt: Date | null;
}

export type GamesInProgressResponse = GameInProgressItem[];
