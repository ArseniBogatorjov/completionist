import { Module } from '@nestjs/common';
import { ScavengerService } from './scavenger.service';
import { ScavengerController } from './scavenger.controller';

@Module({
  controllers: [ScavengerController],
  providers: [ScavengerService],
})
export class ScavengerModule {}
