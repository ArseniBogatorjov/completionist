import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardSkeleton() {
  return (
    <main className="min-h-screen px-6 py-8 text-zinc-100 md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="space-y-3">
          <Skeleton className="h-4 w-24 bg-zinc-800/70" />
          <Skeleton className="h-10 w-52 bg-zinc-800/70" />
          <Skeleton className="h-5 w-full max-w-xl bg-zinc-800/70" />
        </header>

        <section className="space-y-6">
          <Skeleton className="h-7 w-48 bg-zinc-800/70" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="border-white/5 bg-black/20 backdrop-blur-md"
              >
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24 bg-zinc-800/70" />
                </CardHeader>

                <CardContent>
                  <Skeleton className="h-9 w-20 bg-zinc-800/70" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-44 bg-zinc-800/70" />
              <Skeleton className="h-4 w-64 bg-zinc-800/70" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-9 w-16 rounded-md bg-zinc-800/70" />
              <Skeleton className="h-9 w-20 rounded-md bg-zinc-800/70" />
              <Skeleton className="h-9 w-24 rounded-md bg-zinc-800/70" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="border-white/5 bg-black/20 backdrop-blur-md"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-16 w-32 shrink-0 rounded-md bg-zinc-800/70" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full bg-zinc-800/70" />
                    <Skeleton className="h-4 w-2/3 bg-zinc-800/70" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-zinc-800/70" />
                    <Skeleton className="h-4 w-10 bg-zinc-800/70" />
                  </div>

                  <Skeleton className="h-2 w-full bg-zinc-800/70" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
