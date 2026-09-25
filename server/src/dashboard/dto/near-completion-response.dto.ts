import { ApiProperty } from '@nestjs/swagger';

export class NearCompletionResponseDto {
  @ApiProperty({
    example: {
      id: '1646d250-1b84-43b0-859d-066740afb264',
      name: 'Lara Croft and the Guardian of Light',
      coverUrl:
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/35130/header.jpg',
    },
  })
  game: { id: string; name: string; coverUrl: string };

  @ApiProperty({
    example: 2,
  })
  remainingAchievements: number;

  @ApiProperty({
    example: 83.3,
  })
  completionPercent: number;
}
