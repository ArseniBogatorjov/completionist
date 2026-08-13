'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { GameDetails } from '@/types/dashboard/dashboard.types';

export default function GameView() {
  const params = useParams();
  const gameId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiClient<GameDetails>(`/dashboard/game/${gameId}`),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen p-6 text-zinc-100 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-lg bg-zinc-900/50 p-6 backdrop-blur-md border border-white/5">
          <h1 className="text-2xl font-bold text-teal-400 mb-4">
            {data?.game.name}
          </h1>
          <p className="text-zinc-400 mb-2">
            Статус: {data?.status} | Прогресс: {data?.completionPercent}%
          </p>
        </div>
      </div>
    </main>
  );
}
