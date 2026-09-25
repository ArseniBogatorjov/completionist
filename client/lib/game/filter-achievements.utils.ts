import type { Achievement } from '@/types/dashboard/achievement.types';
import type { AchievementFilterOptions } from '@/types/filters/filters.types';

function filterAchievements(
  filter: AchievementFilterOptions,
  achievements: Achievement[],
) {
  switch (filter) {
    case 'all':
      return achievements;
    case 'unlocked':
      return achievements.filter(
        (achievement) => achievement.userAchievements.length > 0,
      );
    case 'locked':
      return achievements.filter(
        (achievement) => achievement.userAchievements.length === 0,
      );
    case 'missable':
      return achievements.filter((achievement) => achievement.isMissable);
    default:
      return achievements;
  }
}

export function getDisplayedAchievements(
  achievements: Achievement[],
  filter: AchievementFilterOptions,
  search: string,
) {
  const filteredAchievements = filterAchievements(filter, achievements);

  const query = search.trim().toLowerCase();

  if (!query) return filteredAchievements;

  return filteredAchievements.filter(
    (achievement) =>
      achievement.name.toLowerCase().includes(query) ||
      achievement.description?.toLowerCase().includes(query),
  );
}
