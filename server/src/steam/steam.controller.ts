import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SteamService } from './steam.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('steam')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('test-games/:steamid')
  async fetchUserGames(@Param('steamid') steamId: string) {
    return this.steamService.fetchUserGames(steamId);
  }
}
