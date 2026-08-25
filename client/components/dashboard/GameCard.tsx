import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { LibraryGame } from '@/types/dashboard/game.types';

interface GameCardProps {
  game: LibraryGame;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/dashboard/game/${game.game.id}`}>
      <Card className="group flex flex-col justify-between overflow-hidden border-white/5 bg-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(102,252,241,0.15)]">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          {game.game.coverUrl ? (
            <div className="relative h-16 w-32 shrink-0 overflow-hidden rounded-md shadow-lg">
              <Image
                src={game.game.coverUrl}
                alt={game.game.name}
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
            {game.game.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 pb-5">
          <div className="flex justify-between text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              ⏱ {Math.round(game.playtimeMinutes / 60)} hrs
            </span>

            <span className="font-medium text-teal-400">
              {game.completionPercent}%
            </span>
          </div>

          <Progress
            value={game.completionPercent}
            className="h-2 bg-zinc-800/50"
          />
        </CardContent>
      </Card>
    </Link>
  );
}
