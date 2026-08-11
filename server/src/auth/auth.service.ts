import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type {
  JwtPayload,
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_REFRESH_EXPIRES_IN: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_REFRESH_EXPIRES_IN = configService.getOrThrow(
      'JWT_REFRESH_EXPIRES_IN',
    );
    this.JWT_REFRESH_SECRET =
      configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  public async register(dto: RegisterDto): Promise<RegisterResponse> {
    const { username, email, password, avatarUrl } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = (await argon2.hash(password)) as string;

    return this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        avatarUrl,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  public async login(dto: LoginDto): Promise<LoginResponse> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.JWT_REFRESH_EXPIRES_IN as JwtSignOptions['expiresIn'],
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  public async refreshTokens(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    try {
      const { sub, email } = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.JWT_REFRESH_SECRET,
        },
      );

      return {
        accessToken: await this.jwtService.signAsync({ sub, email }),
        refreshToken: await this.jwtService.signAsync(
          { sub, email },
          {
            secret: this.JWT_REFRESH_SECRET,
            expiresIn: this
              .JWT_REFRESH_EXPIRES_IN as JwtSignOptions['expiresIn'],
          },
        ),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
