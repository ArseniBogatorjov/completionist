import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatsResponse } from './types/dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserStats(userId: string): Promise<UserStatsResponse> {
    const [totalGames, completedGames, rawAvgResponse] = await Promise.all([
      this.prisma.userGame.count({
        where: {
          userId,
        },
      }),
      this.prisma.userGame.count({
        where: {
          userId,
          status: 'completed',
        },
      }),
      this.prisma.userGame.aggregate({
        _avg: {
          completionPercent: true,
        },
        where: {
          userId,
        },
      }),
    ]);

    const rawAvg = rawAvgResponse._avg.completionPercent ?? 0;

    const averageCompletionPercent = Math.round(rawAvg * 10) / 10;

    return {
      totalGames,
      completedGames,
      averageCompletionPercent,
    };
  }
}
