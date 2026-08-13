import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
  totalGames: number | undefined;
  completedGames: number | undefined;
  averageCompletionPercent: number | undefined;
}

export default function StatisticsSection({
  totalGames,
  completedGames,
  averageCompletionPercent,
}: DashboardStatsProps) {
  return (
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
            <div className="text-3xl font-bold">{totalGames}</div>
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
              {completedGames}
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
              {averageCompletionPercent}%
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
