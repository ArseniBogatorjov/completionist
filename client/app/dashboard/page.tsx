'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import GamesList from '@/components/dashboard/GamesList';
import { useState } from 'react';
import DashboardFilter from '@/components/dashboard/DashboardFilter';
import type {
  DashboardStats,
  FilterOptions,
} from '@/types/dashboard/dashboard.types';
import type { LibraryGame } from '@/types/dashboard/game.types';
import DataErrorPage from '@/components/error/DataErrorPage';
import { filterGames } from '@/lib/dashboard/filter.utils';

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
        <DashboardFilter filter={filter} setFilter={setFilter} />
        <GamesList games={filteredGames} />
      </div>
    </main>
  );
}
