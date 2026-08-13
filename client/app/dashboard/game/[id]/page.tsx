'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import type { GameDetails } from '@/types/dashboard/dashboard.types';

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiClient<GameDetails>(`/dashboard/game/${gameId}`),
  });
  return (
    <div>
      <div>{data?.game.name}</div>
    </div>
  );
}
