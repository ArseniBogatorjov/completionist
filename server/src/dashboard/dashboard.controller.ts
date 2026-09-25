import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { StatisticsResponseDto } from './dto/stats-response.dto';
import { LibraryResponseDto } from './dto/library-response.dto';
import { NearCompletionResponseDto } from './dto/near-completion-response.dto';
import { GameDetailsResponseDto } from './dto/game-details-response.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Get user statistics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User statistics',
    type: StatisticsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/stats')
  async getUserStats(@CurrentUser() user: User) {
    return await this.dashboardService.getUserStats(user.id);
  }

  @ApiOperation({
    summary: 'Get user library',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user games',
    type: [LibraryResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/library')
  async getUserGames(@CurrentUser() user: User) {
    return await this.dashboardService.getUserGames(user.id);
  }

  @ApiOperation({
    summary: 'Get user games near completion',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of games near completion',
    type: [NearCompletionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/near-completion')
  async getNearCompletionGames(@CurrentUser() user: User) {
    return await this.dashboardService.getNearCompletionGames(user.id);
  }

  @ApiOperation({
    summary: 'Get game details by game id',
  })
  @ApiParam({
    name: 'id',
    description: 'Game ID',
    example: '9b318425-3bc9-456b-b9b7-66b7c5ff66b1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game details by game id',
    type: GameDetailsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/game/:id')
  async getDetail(@Param('id') gameId: string, @CurrentUser() user: User) {
    return await this.dashboardService.getGameDetails(user.id, gameId);
  }
}
