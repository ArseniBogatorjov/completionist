import { ConfigService } from '@nestjs/config';

export function getJwtConfig(configService: ConfigService) {
  return {
    secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    singOptions: {
      expiresIn: configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'),
    },
  };
}
