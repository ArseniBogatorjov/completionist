import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SteamService } from './steam.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { SyncSteamDto } from './dto/sync-steam.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusResponseDto } from '../auth/dto/status-response.dto';

@Controller('steam')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @ApiOperation({
    summary: 'Get user steam data',
    description: 'Retrieves user games and achievements from steam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusResponseDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  syncUserGames(@CurrentUser() user: User, @Body() dto: SyncSteamDto) {
    this.steamService
      .syncUserGames(user.id, dto)
      .catch((error) => console.error(error));
    return { message: 'synchronization started' };
  }
}
