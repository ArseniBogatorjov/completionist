'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface DashboardStats {
  totalGames: number;
  completedGames: number;
  averageCompletionPercent: number;
}

interface PlayingGame {
  game: {
    id: string;
    name: string;
    coverUrl: string;
  };
  completionPercent: number;
  playtimeMinutes: number;
  lastPlayedAt: number;
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
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Overall Statistics
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-white/5 bg-black/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Total Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats?.totalGames ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-black/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Perfect (100%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-400">
                  {stats?.completedGames ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-black/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Avg. Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats?.averageCompletionPercent ?? 0}%
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Currently Playing
          </h2>

          {!playingGames || playingGames.length === 0 ? (
            <p className="text-zinc-500">No games in progress yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {playingGames.map((item) => (
                <Card
                  key={item.game.id}
                  className="group flex flex-col justify-between overflow-hidden border-white/5 bg-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(102,252,241,0.15)]"
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    {item.game.coverUrl ? (
                      <div className="relative h-16 w-32 shrink-0 overflow-hidden rounded-md shadow-lg">
                        <Image
                          src={item.game.coverUrl}
                          alt={item.game.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="flex h-16 w-32 shrink-0 items-center justify-center rounded-md bg-zinc-800/50 text-xs text-zinc-500">
                        No Image
                      </div>
                    )}
                    <CardTitle className="line-clamp-2 text-base leading-tight text-zinc-100 transition-colors group-hover:text-teal-400">
                      {item.game.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-5">
                    <div className="flex justify-between text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        ⏱ {Math.round(item.playtimeMinutes / 60)} hrs
                      </span>
                      <span className="font-medium text-teal-400">
                        {item.completionPercent}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                      <div
                        className="h-full rounded-full bg-teal-400 shadow-[0_0_10px_rgba(102,252,241,0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${item.completionPercent}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
