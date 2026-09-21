import { Controller } from '@nestjs/common';
import { ScavengerService } from './scavenger.service';

@Controller('scavenger')
export class ScavengerController {
  constructor(private readonly scavengerService: ScavengerService) {}
}
