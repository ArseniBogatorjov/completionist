'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import GamesList from '@/components/dashboard/GamesList';
import { useState } from 'react';
import FilterButtons from '@/components/dashboard/FilterButtons';
import type {
  DashboardStats,
  FilterOptions,
} from '@/types/dashboard/dashboard.types';
import type { GameInProgress } from '@/types/dashboard/game.types';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import DashboardError from '@/components/dashboard/DashboardError';

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
    data: GamesInProgress,
    isLoading: isPlayingLoading,
    isError: isPlayingError,
  } = useQuery<GameInProgress[]>({
    queryKey: ['dashboard', 'playing'],
    queryFn: () => apiClient('/dashboard/library'),
  });

  const [filter, setFilter] = useState<FilterOptions>('all');

  if (isStatsLoading || isPlayingLoading) {
    return <DashboardSkeleton />;
  }

  if (isStatsError || isPlayingError) {
    return <DashboardError />;
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <StatisticsSection
          totalGames={stats?.totalGames ?? 0}
          completedGames={stats?.completedGames ?? 0}
          averageCompletionPercent={stats?.averageCompletionPercent ?? 0}
        />
        <FilterButtons filter={filter} setFilter={setFilter} />
        <GamesList games={GamesInProgress ?? []} />
      </div>
    </main>
  );
}
