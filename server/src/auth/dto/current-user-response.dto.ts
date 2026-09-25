import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'John',
  })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string;

  @ApiProperty({
    example: '2026-09-25T12:00:00.000Z',
  })
  createdAt: string;
}
