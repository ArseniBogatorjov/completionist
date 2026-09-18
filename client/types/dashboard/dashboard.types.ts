export interface DashboardStats {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

export type GameFilterOptions = 'all' | 'playing' | 'completed' | 'backlog';

export interface GameFilters {
  value: GameFilterOptions;
  label: string;
  className: string;
}
