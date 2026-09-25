import { ApiProperty } from '@nestjs/swagger';

class AchievementDto {
  @ApiProperty({
    example: '9b318425-3bc9-456b-b9b7-66b7c5ff66b1',
  })
  id: string;

  @ApiProperty({
    example: 'DRAG AND DROP',
  })
  name: string;

  @ApiProperty({
    example: 'Rescue a Survivor from a Smokers tongue before he takes damage.',
  })
  description: string;

  @ApiProperty({
    example:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/500/2c92650ca214271a191e37c54e2ae9c92d82e160.jpg',
  })
  iconUrl: string;

  @ApiProperty({
    example: 62.8,
  })
  globalRarity: number;

  @ApiProperty({
    example: false,
  })
  isMissable: boolean;

  @ApiProperty({
    example: [
      {
        unlockedAt: '2014-11-02T14:43:59.000Z',
      },
    ],
  })
  userAchievements: {
    unlockedAt: string;
  }[];
}

class GameDto {
  @ApiProperty({
    example: 'Left 4 dead',
  })
  name: string;

  @ApiProperty({
    example:
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/500/header.jpg',
  })
  coverUrl: string;

  @ApiProperty({
    type: [AchievementDto],
  })
  achievements: AchievementDto[];
}

export class GameDetailsResponseDto {
  @ApiProperty({
    example: 460,
  })
  playtimeMinutes: number;

  @ApiProperty({
    example: 'completed',
    enum: ['backlog', 'completed', 'playing'],
  })
  status: string;

  @ApiProperty({
    example: 100,
  })
  completionPercent: number;

  @ApiProperty({
    type: GameDto,
  })
  game: GameDto;
}
