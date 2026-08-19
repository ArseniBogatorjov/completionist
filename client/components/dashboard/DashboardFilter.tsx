import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import type { FilterOptions } from '@/types/dashboard/dashboard.types';

interface FiltersProps {
  filter: FilterOptions;
  setFilter: Dispatch<SetStateAction<FilterOptions>>;
}

export default function DashboardFilter({ filter, setFilter }: FiltersProps) {
  return (
    <div className="inline-flex w-fit items-center rounded-lg border border-white/5 bg-black/20 p-1 backdrop-blur-md">
      <Button
        size="sm"
        variant={filter === 'all' ? 'default' : 'ghost'}
        onClick={() => setFilter('all')}
        className="min-w-16"
      >
        All
      </Button>

      <Button
        size="sm"
        variant={filter === 'playing' ? 'default' : 'ghost'}
        onClick={() => setFilter('playing')}
        className="min-w-20"
      >
        Playing
      </Button>

      <Button
        size="sm"
        variant={filter === 'completed' ? 'default' : 'ghost'}
        onClick={() => setFilter('completed')}
        className="min-w-24"
      >
        Completed
      </Button>

      <Button
        size="sm"
        variant={filter === 'backlog' ? 'default' : 'ghost'}
        onClick={() => setFilter('backlog')}
        className="min-w-24"
      >
        Backlog
      </Button>
    </div>
  );
}
