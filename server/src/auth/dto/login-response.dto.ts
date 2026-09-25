import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
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
}
