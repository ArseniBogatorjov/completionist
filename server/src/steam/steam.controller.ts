import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SteamService } from './steam.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { SyncSteamDto } from './dto/sync-steam.dto';

@Controller('steam')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('test-games/:steamid')
  async fetchUserGames(@Param('steamid') steamId: string) {
    return this.steamService.fetchUserGames(steamId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  async syncUserGames(@CurrentUser() user: User, @Body() dto: SyncSteamDto) {
    return this.steamService.syncUserGames(user.id, dto);
  }
}
