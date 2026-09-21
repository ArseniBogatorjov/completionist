import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';
import { SteamController } from './steam.controller';
import { ScavengerService } from '../scavenger/scavenger.service';

@Module({
  controllers: [SteamController],
  providers: [SteamService, ScavengerService],
})
export class SteamModule {}
