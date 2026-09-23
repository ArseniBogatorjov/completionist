export interface FilterButton<T extends string> {
  value: T;
  label: string;
  className: string;
}

export type AchievementFilterOptions =
  'all' | 'unlocked' | 'locked' | 'missable';

export type GameFilterOptions = 'all' | 'playing' | 'completed' | 'backlog';
