import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: Request): Express.User | undefined;
}
