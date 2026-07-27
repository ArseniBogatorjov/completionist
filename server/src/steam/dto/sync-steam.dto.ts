import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SyncSteamDto {
  @IsNotEmpty({ message: 'SteamId cannot be empty' })
  @IsString()
  @Matches(/^765611\d{11}$/, {
    message: 'Invalid format SteamID64 (must contain 17 digits)',
  })
  steamId: string;
}
