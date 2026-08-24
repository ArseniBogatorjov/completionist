export interface DashboardStats {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

export type FilterOptions = 'all' | 'playing' | 'completed' | 'backlog';

export interface Filters {
  value: FilterOptions;
  label: string;
  className: string;
}
