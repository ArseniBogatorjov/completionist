import { ApiProperty } from '@nestjs/swagger';

export class LibraryResponseDto {
  @ApiProperty({
    example: {
      id: 'a3f49be5-4ee6-4bdd-bcf3-d5cb8ca2983d',
      name: 'Left 4 Dead',
      coverUrl:
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/500/header.jpg',
    },
  })
  game: {
    id: string;
    name: string;
    coverUrl: string;
  };

  @ApiProperty({
    example: 100,
  })
  completionPercent: number;

  @ApiProperty({
    example: 460,
  })
  playtimeMinutes: number;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  lastPlayedAt: string | null;

  @ApiProperty({
    example: 'completed',
  })
  status: string;
}
