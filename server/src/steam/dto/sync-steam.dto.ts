import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyncSteamDto {
  @ApiProperty({
    example: '76569999089090909',
  })
  @IsNotEmpty({ message: 'SteamId cannot be empty' })
  @IsString()
  @Matches(/^765611\d{11}$/, {
    message: 'Invalid format SteamID64 (must contain 17 digits)',
  })
  steamId: string;
}
