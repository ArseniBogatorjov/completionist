import { Dispatch, SetStateAction } from 'react';
import type { FilterButton } from '@/types/filters/filters.types';
import { Button } from '@/components/ui/button';

interface FilterButtonsProps<T> {
  filter: T;
  setFilter: Dispatch<SetStateAction<T>>;
  filters: FilterButton<T>[];
}

export default function FilterButtons<T extends string>({
  filter,
  setFilter,
  filters,
}: FilterButtonsProps<T>) {
  return (
    <div className="inline-flex w-fit items-center rounded-lg border border-white/5 bg-black/20 p-1 backdrop-blur-md">
      {filters.map(({ value, label, className }) => (
        <Button
          key={value}
          variant={filter === value ? 'default' : 'ghost'}
          onClick={() => setFilter(value)}
          className={className}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
