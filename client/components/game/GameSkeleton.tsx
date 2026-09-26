import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function GameSkeleton() {
  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <Card className="w-full overflow-hidden border-white/5 bg-black/20 backdrop-blur-md">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
            <Skeleton className="aspect-460/215 w-full shrink-0 rounded-lg bg-zinc-800/70 md:w-80" />

            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-9 w-2/3 bg-zinc-800/70" />
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-800/70" />
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border border-white/5 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md bg-zinc-800/70" />

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16 bg-zinc-800/70" />
                    <Skeleton className="h-4 w-20 bg-zinc-800/70" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md bg-zinc-800/70" />

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 bg-zinc-800/70" />
                    <Skeleton className="h-4 w-24 bg-zinc-800/70" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-zinc-800/70" />
                  <Skeleton className="h-4 w-10 bg-zinc-800/70" />
                </div>

                <Skeleton className="h-2.5 w-full bg-zinc-800/70" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-md bg-zinc-800/70" />
            <Skeleton className="h-9 w-24 rounded-md bg-zinc-800/70" />
            <Skeleton className="h-9 w-20 rounded-md bg-zinc-800/70" />
            <Skeleton className="h-9 w-24 rounded-md bg-zinc-800/70" />
          </div>

          <Skeleton className="h-9 w-full rounded-md bg-zinc-800/70 sm:w-64" />
        </div>

        <div className="flex w-full flex-col gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="flex flex-row items-center gap-5 border-white/10 bg-black/30 p-5 backdrop-blur-md"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-xl bg-zinc-800/70" />

              <div className="flex min-w-0 flex-1 flex-col justify-center space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-48 bg-zinc-800/70" />
                  <Skeleton className="h-5 w-20 rounded-full bg-zinc-800/70" />
                </div>

                <Skeleton className="h-4 w-3/4 bg-zinc-800/70" />
                <Skeleton className="h-4 w-1/2 bg-zinc-800/70" />
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <Skeleton className="h-6 w-24 rounded-full bg-zinc-800/70" />
                <Skeleton className="h-4 w-24 bg-zinc-800/70" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
