import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LibraryGame } from '@/types/dashboard/game.types';

interface GamesList {
  games: LibraryGame[];
}

export default function GamesList({ games }: GamesList) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold tracking-tight">Games library</h2>

      {games.length === 0 ? (
        <p className="text-zinc-500">No games to display</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((item) => (
            <Link href={`/dashboard/game/${item.game.id}`} key={item.game.id}>
              <Card className="group flex flex-col justify-between overflow-hidden border-white/5 bg-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(102,252,241,0.15)]">
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

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
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

                  <Progress
                    value={item.completionPercent}
                    className="h-2 bg-zinc-800/50"
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
