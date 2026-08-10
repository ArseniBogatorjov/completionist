import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SteamService } from './steam.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { SyncSteamDto } from './dto/sync-steam.dto';

@Controller('steam')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  syncUserGames(@CurrentUser() user: User, @Body() dto: SyncSteamDto) {
    this.steamService
      .syncUserGames(user.id, dto)
      .catch((error) => console.error(error));
    return { message: 'synchronization started' };
  }
}
