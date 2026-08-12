import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameDetails, GameInProgressItem, NearCompletionGameItem, UserStatsResponse, } from './types/dashboard.types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserStats(userId: string): Promise<UserStatsResponse> {
    const [totalGames, completedGames, avgResult] = await Promise.all([
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

    const rawAvg = avgResult._avg.completionPercent ?? 0;

    const averageCompletionPercent = Math.round(rawAvg * 10) / 10;

    return {
      totalGames,
      completedGames,
      averageCompletionPercent,
    };
  }

  public async getGamesInProgress(
    userId: string,
  ): Promise<GameInProgressItem[]> {
    const gamesInProgress = await this.prisma.userGame.findMany({
      where: {
        userId,
        status: 'playing',
      },
      select: {
        game: {
          select: {
            id: true,
            name: true,
            coverUrl: true,
          },
        },
        completionPercent: true,
        playtimeMinutes: true,
        lastPlayedAt: true,
      },
      orderBy: {
        lastPlayedAt: 'desc',
      },
    });

    return gamesInProgress;
  }

  public async getNearCompletionGames(
    userId: string,
  ): Promise<NearCompletionGameItem[]> {
    const candidateGames = await this.prisma.userGame.findMany({
      where: {
        userId,
        completionPercent: { gte: 80, lt: 100 },
      },
      select: {
        gameId: true,
        completionPercent: true,
        game: {
          select: {
            name: true,
            coverUrl: true,
            _count: { select: { achievements: true } },
          },
        },
      },
      orderBy: { completionPercent: 'desc' },
    });

    const unlockedAchievements = await this.prisma.userAchievement.findMany({
      where: {
        userId,
        achievement: {
          gameId: { in: candidateGames.map((candidate) => candidate.gameId) },
        },
      },
      select: {
        achievement: { select: { gameId: true } },
      },
    });

    const nearCompletionGames: NearCompletionGameItem[] = [];

    for (const candidate of candidateGames) {
      const total = candidate.game._count.achievements;

      const unlocked = unlockedAchievements.filter(
        (item) => item.achievement.gameId === candidate.gameId,
      ).length;

      const remainingAchievements = total - unlocked;

      if (remainingAchievements >= 1 && remainingAchievements <= 3) {
        nearCompletionGames.push({
          gameId: candidate.gameId,
          completionPercent: candidate.completionPercent,
          game: {
            name: candidate.game.name,
            coverUrl: candidate.game.coverUrl,
          },
          remainingAchievements,
        });
      }

      if (nearCompletionGames.length === 3) break;
    }

    return nearCompletionGames;
  }

  public async getGameDetails(
    userId: string,
    gameId: string,
  ): Promise<GameDetails> {
    const gameDetails = await this.prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      select: {
        playtimeMinutes: true,
        status: true,
        completionPercent: true,
        game: {
          select: {
            name: true,
            coverUrl: true,
            achievements: {
              select: {
                id: true,
                name: true,
                description: true,
                iconUrl: true,
                globalRarity: true,
                isMissable: true,
                userAchievements: {
                  where: { userId },
                  select: { unlockedAt: true },
                },
              },
              orderBy: { globalRarity: 'desc' },
            },
          },
        },
      },
    });

    if (!gameDetails) {
      throw new NotFoundException('Game not found in user profile');
    }

    return gameDetails as unknown as GameDetails;
  }
}
