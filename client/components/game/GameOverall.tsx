import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Gamepad2, Trophy } from 'lucide-react';
import Image from 'next/image';
import { CompletionStatus } from '@/types/dashboard/dashboard.types';

interface GameOverallProps {
  name: string;
  poster: string;
  playtimeMinutes: number;
  completionPercent: number;
  status: CompletionStatus;
  totalAchievements: number;
  unlockedAchievements: number;
}

export default function GameOverall({
  name,
  poster,
  playtimeMinutes,
  completionPercent,
  status = 'playing',
  totalAchievements,
  unlockedAchievements,
}: GameOverallProps) {
  const playtimeHours = Math.round(playtimeMinutes / 60);

  return (
    <Card className="w-full overflow-hidden border-white/5 bg-black/20 backdrop-blur-md">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <div className="relative aspect-460/215 w-full shrink-0 overflow-hidden rounded-lg bg-zinc-800/50 text-zinc-500 md:w-80">
          {poster ? (
            <Image
              src={poster}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <Gamepad2 className="h-10 w-10" />
              <span className="text-xs font-medium">No cover</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
                {name}
              </h1>
              {status && (
                <Badge
                  variant="outline"
                  className="shrink-0 border-teal-500/30 bg-teal-500/10 text-teal-400 uppercase text-xs tracking-wider"
                >
                  {status}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border border-white/5 bg-white/5 p-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-800/80 text-zinc-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Playtime</p>
                <p className="text-sm font-semibold text-zinc-100">
                  {playtimeHours} hrs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Achievements</p>
                <p className="text-sm font-semibold text-zinc-100">
                  {unlockedAchievements} / {totalAchievements}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Completion</span>
              <span className="font-semibold text-teal-400">
                {completionPercent}%
              </span>
            </div>
            <Progress
              value={completionPercent}
              className="h-2.5 bg-zinc-800/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
