'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api/apiClient';
import type { GameDetails } from '@/types/dashboard/game.types';
import GameOverall from '@/components/game/GameOverall';
import DataErrorPage from '@/components/error/DataErrorPage';
import AchievementList from '@/components/game/AchievementList';
import { useState } from 'react';
import type { AchievementFilterOptions } from '@/types/filters/filters.types';
import { FilterButton } from '@/types/filters/filters.types';
import Searchbar from '@/components/shared/Searchbar';
import { getDisplayedAchievements } from '@/lib/game/filter-achievements.utils';
import FilterButtons from '@/components/shared/FilterButtons';

const filters: FilterButton<AchievementFilterOptions>[] = [
  { value: 'all', label: 'All', className: 'min-w-16' },
  { value: 'unlocked', label: 'Unlocked', className: 'min-w-24' },
  { value: 'locked', label: 'Locked', className: 'min-w-20' },
  { value: 'missable', label: 'Missable', className: 'min-w-24' },
];

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
          <FilterButtons
            filter={filter}
            setFilter={setFilter}
            filters={filters}
          />
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
