'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api/apiClient';
import type { GameDetails } from '@/types/dashboard/game.types';
import GameOverall from '@/components/game/GameOverall';
import DataErrorPage from '@/components/error/DataErrorPage';
import AchievementList from '@/components/game/AchievementList';
import AchievementFilter from '@/components/game/AchievementFilter';
import { useState } from 'react';
import type { AchievementFilterOptions } from '@/types/dashboard/achievement.types';
import Searchbar from '@/components/shared/Searchbar';
import { getDisplayedAchievements } from '@/lib/game/filter-achievements.utils';

export default function GamePage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AchievementFilterOptions>('all');

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

  const filteredAchievements = getDisplayedAchievements(
    data?.game.achievements ?? [],
    filter,
    search,
  );

  if (isError) {
    return <DataErrorPage />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <GameOverall
          name={data?.game.name ?? 'Game name is missing'}
          poster={data?.game.coverUrl ?? ''}
          playtimeMinutes={data?.playtimeMinutes ?? 0}
          completionPercent={data?.completionPercent ?? 0}
          status={data?.status ?? 'playing'}
          totalAchievements={data?.game.achievements?.length ?? 0}
          unlockedAchievements={unlockedAchievements}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AchievementFilter filter={filter} setFilter={setFilter} />
          <Searchbar
            search={search}
            setSearch={setSearch}
            placeholder="Search for achievement..."
          />
        </div>
        <AchievementList achievements={filteredAchievements} />
      </div>
    </main>
  );
}
