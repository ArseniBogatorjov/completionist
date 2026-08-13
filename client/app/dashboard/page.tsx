'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import type { PlayingGame } from '@/types/dashboard/dashboard.types';
import ProgressGamesSection from '@/components/dashboard/ProgressGamesSection';

interface DashboardStats {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

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
    data: playingGames,
    isLoading: isPlayingLoading,
    isError: isPlayingError,
  } = useQuery<PlayingGame[]>({
    queryKey: ['dashboard', 'playing'],
    queryFn: () => apiClient('/dashboard/playing'),
  });

  if (isStatsLoading || isPlayingLoading) {
    return <div>Loading...</div>;
  }

  if (isStatsError || isPlayingError) {
    return <div>Error while loading</div>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <StatisticsSection
          totalGames={stats?.totalGames ?? 0}
          completedGames={stats?.completedGames ?? 0}
          averageCompletionPercent={stats?.averageCompletionPercent ?? 0}
        />

        <ProgressGamesSection games={playingGames ?? []} />
      </div>
    </main>
  );
}
