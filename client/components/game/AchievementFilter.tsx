import type {
  AchievementFilterOptions,
  AchievementFilters,
} from '@/types/dashboard/achievement.types';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';

interface AchievementFilterProps {
  filter: AchievementFilterOptions;
  setFilter: Dispatch<SetStateAction<AchievementFilterOptions>>;
}

const filters: AchievementFilters[] = [
  { value: 'all', label: 'All', className: 'min-w-16' },
  { value: 'unlocked', label: 'Unlocked', className: 'min-w-24' },
  { value: 'locked', label: 'Locked', className: 'min-w-20' },
];

export default function AchievementFilter({
  filter,
  setFilter,
}: AchievementFilterProps) {
  return (
    <div className="inline-flex w-fit items-center rounded-lg border border-white/5 bg-black/20 p-1 backdrop-blur-md">
      {filters.map(({ value, label, className }) => (
        <Button
          key={value}
          variant={filter === value ? 'default' : 'ghost'}
          value={value}
          onClick={() => setFilter(value)}
          className={className}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
