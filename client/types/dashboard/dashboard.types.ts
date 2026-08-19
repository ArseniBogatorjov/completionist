export interface DashboardStats {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

export type FilterOptions = 'all' | 'playing' | 'completed';
