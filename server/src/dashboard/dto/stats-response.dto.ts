import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponseDto {
  @ApiProperty({ example: 23 })
  totalGames: number;

  @ApiProperty({ example: 9 })
  completedGames: number;

  @ApiProperty({ example: 60 })
  averageCompletionPercent: number;
}
