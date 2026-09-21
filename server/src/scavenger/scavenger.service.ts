import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ScavengerGame } from './types/scavenger.responses';

@Injectable()
export class ScavengerService {
  private readonly logger = new Logger(ScavengerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateMissableAchievements(
    gameId: string,
    steamAppId: number,
  ): Promise<void> {
    try {
      const url = `https://raw.githubusercontent.com/batureren/achievement-scavenger-database/main/games/${steamAppId}.json`;

      const response = await fetch(url);

      if (response.status === 404) {
        this.logger.log(`No Scavenger data for Steam AppID ${steamAppId}`);
        return;
      }

      if (!response.ok) {
        this.logger.warn(
          `Scavenger returned status ${response.status} for AppID ${steamAppId}`,
        );
        return;
      }

      const data = (await response.json()) as ScavengerGame;

      if (!data.achievements?.length) {
        return;
      }

      for (const achievement of data.achievements) {
        await this.prisma.achievement.updateMany({
          where: {
            gameId,
            apiname: achievement.apiname,
          },
          data: {
            isMissable: achievement.is_missable,
          },
        });
      }

      this.logger.log(
        `Updated ${data.achievements.length} missable statuses for AppID ${steamAppId}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to fetch Scavenger data for AppID ${steamAppId}: ${error}`,
      );
    }
  }
}
