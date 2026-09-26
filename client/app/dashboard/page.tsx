'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import GamesList from '@/components/dashboard/GamesList';
import { useState } from 'react';
import type { DashboardStats } from '@/types/dashboard/dashboard.types';
import type {
  FilterButton,
  GameFilterOptions,
} from '@/types/filters/filters.types';
import type { LibraryGame } from '@/types/dashboard/game.types';
import DataErrorPage from '@/components/error/DataErrorPage';
import { getDisplayedGames } from '@/lib/dashboard/filter-games.utils';
import Searchbar from '@/components/shared/Searchbar';
import SteamSyncSection from '@/components/dashboard/SteamSyncSection';
import FilterButtons from '@/components/shared/FilterButtons';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

const filters: FilterButton<GameFilterOptions>[] = [
  { value: 'all', label: 'All', className: 'min-w-16' },
  { value: 'playing', label: 'Playing', className: 'min-w-20' },
  { value: 'completed', label: 'Completed', className: 'min-w-24' },
  { value: 'backlog', label: 'Backlog', className: 'min-w-24' },
];

export default function Dashboard() {
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient('/dashboard/stats'),
  });

  const {
    data: games,
    isLoading: isPlayingLoading,
    isError: isPlayingError,
  } = useQuery<LibraryGame[]>({
    queryKey: ['dashboard', 'playing'],
    queryFn: () => apiClient('/dashboard/library'),
  });

  const [filter, setFilter] = useState<GameFilterOptions>('all');
  const [search, setSearch] = useState<string>('');

  const filteredGames = getDisplayedGames(games ?? [], filter, search);

  if (isStatsLoading || isPlayingLoading) {
    return <DashboardSkeleton />;
  }

  if (isStatsError || isPlayingError) {
    return <DataErrorPage />;
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <StatisticsSection
          totalGames={stats?.totalGames ?? 0}
          completedGames={stats?.completedGames ?? 0}
          averageCompletionPercent={stats?.averageCompletionPercent ?? 0}
        />
        <SteamSyncSection />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterButtons
            filter={filter}
            setFilter={setFilter}
            filters={filters}
          />
          <Searchbar
            search={search}
            setSearch={setSearch}
            placeholder="Search for game..."
          />
        </div>
        <GamesList games={filteredGames} />
      </div>
    </main>
  );
}
