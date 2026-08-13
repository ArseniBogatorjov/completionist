import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/stats')
  async getUserStats(@CurrentUser() user: User) {
    return await this.dashboardService.getUserStats(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/playing')
  async getGamesInProgress(@CurrentUser() user: User) {
    return await this.dashboardService.getGamesInProgress(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/near-completion')
  async getNearCompletionGames(@CurrentUser() user: User) {
    return await this.dashboardService.getNearCompletionGames(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/game/:id')
  async getDetail(@Param('id') gameId: string, @CurrentUser() user: User) {
    return await this.dashboardService.getGameDetails(user.id, gameId);
  }
}
