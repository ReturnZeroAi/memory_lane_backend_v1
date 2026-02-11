import type { Request, Response } from 'express';
import { authService } from './service.js';
import { ApiResponse } from '../../libs/shared/response/index.js';
import type { RegisterDto, LoginDto } from './dto.js';

export class AuthHandler {
  async register(req: Request, res: Response): Promise<void> {
    const data = req.body as RegisterDto;
    const result = await authService.register(data);
    ApiResponse.created(res, result, 'Registration successful');
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginDto;
    const result = await authService.login(data);
    ApiResponse.success(res, result, 'Login successful');
  }
}

export const authHandler = new AuthHandler();
