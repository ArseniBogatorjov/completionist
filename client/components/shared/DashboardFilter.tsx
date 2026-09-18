import { Dispatch, SetStateAction } from 'react';
import type {
  GameFilterOptions,
  GameFilters,
} from '@/types/dashboard/dashboard.types';
import { Button } from '@/components/ui/button';

interface FiltersProps {
  filter: GameFilterOptions;
  setFilter: Dispatch<SetStateAction<GameFilterOptions>>;
}

const filters: GameFilters[] = [
  { value: 'all', label: 'All', className: 'min-w-16' },
  { value: 'playing', label: 'Playing', className: 'min-w-20' },
  { value: 'completed', label: 'Completed', className: 'min-w-24' },
  { value: 'backlog', label: 'Backlog', className: 'min-w-24' },
];

export default function DashboardFilter({ filter, setFilter }: FiltersProps) {
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
