'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api/apiClient';
import type { GameDetails } from '@/types/dashboard/game.types';
import GameOverall from '@/components/game/GameOverall';
import DataErrorPage from '@/components/error/DataErrorPage';

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiClient<GameDetails>(`/dashboard/game/${gameId}`),
  });

  const unlockedAchievements =
    data?.game.achievements?.filter(
      (achievement) =>
        achievement.userAchievements && achievement.userAchievements.length > 0,
    ).length ?? 0;

  if (isError) {
    return <DataErrorPage />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
    // TODO: ADD SKELETON
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <GameOverall
          name={data?.game.name ?? 'Game name is missing'}
          poster={data?.game.coverUrl ?? ''}
          playtimeMinutes={data?.playtimeMinutes ?? 0}
          completionPercent={data?.completionPercent ?? 0}
          status={data?.status}
          totalAchievements={data?.game.achievements?.length ?? 0}
          unlockedAchievements={unlockedAchievements}
        />
      </div>
    </main>
  );
}
