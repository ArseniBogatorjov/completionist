'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import GamesList from '@/components/dashboard/GamesList';
import { useState } from 'react';
import DashboardFilter from '@/components/dashboard/DashboardFilter';
import { DashboardStats, FilterOptions, } from '@/types/dashboard/dashboard.types';
import type { LibraryGame } from '@/types/dashboard/game.types';
import DataErrorPage from '@/components/error/DataErrorPage';
import { filterGames } from '@/lib/dashboard/filter.utils';
import Searchbar from '@/components/dashboard/Searchbar';

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

  const [filter, setFilter] = useState<FilterOptions>('all');
  const [search, setSearch] = useState<string>('');

  const filteredGames = filterGames(filter, games ?? []);

  if (isStatsLoading || isPlayingLoading) {
    return <DataErrorPage />;
  }

  if (isStatsError || isPlayingError) {
    return <DataErrorPage />;
  }

  if (games && games.length > 0) {
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <StatisticsSection
          totalGames={stats?.totalGames ?? 0}
          completedGames={stats?.completedGames ?? 0}
          averageCompletionPercent={stats?.averageCompletionPercent ?? 0}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DashboardFilter filter={filter} setFilter={setFilter} />
          <Searchbar search={search} setSearch={setSearch} />
        </div>
        <GamesList games={filteredGames} />
      </div>
    </main>
  );
}
