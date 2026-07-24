import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    private readonly prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    getProfile(user: User): {
        id: string;
        steamId: string | null;
        username: string;
        avatarUrl: string | null;
        email: string | null;
        passwordHash: string | null;
        telegramId: bigint | null;
        createdAt: Date;
    };
    register(dto: RegisterDto): Promise<{
        id: string;
        username: string;
        avatarUrl: string | null;
        email: string | null;
        createdAt: Date;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        id: string;
        username: string;
        email: string | null;
        avatarUrl: string | null;
    }>;
    logout(res: Response): {
        status: string;
    };
}
