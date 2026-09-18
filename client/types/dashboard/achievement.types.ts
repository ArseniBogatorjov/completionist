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

export type AchievementFilterOptions = 'all' | 'unlocked' | 'locked';

export interface AchievementFilters {
  value: AchievementFilterOptions;
  label: string;
  className: string;
}
