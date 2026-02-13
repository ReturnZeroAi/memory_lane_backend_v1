import type { Request, Response } from 'express';
import { authService } from './service.js';
import { ApiResponse } from '@libs/shared/response/index.js';
import { config } from '@libs/shared/config/index.js';
import { UnauthorizedError } from '@libs/shared/errors/index.js';
import type { RegisterDto, LoginDto } from './dto.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'strict',
    path: '/api/v1/auth',
  });
}

function getSessionMeta(req: Request) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}

export class AuthHandler {
  async register(req: Request, res: Response): Promise<void> {
    const data = req.body as RegisterDto;
    const result = await authService.register(data, getSessionMeta(req));

    setRefreshCookie(res, result.refreshToken);

    ApiResponse.created(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Registration successful');
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginDto;
    const result = await authService.login(data, getSessionMeta(req));

    setRefreshCookie(res, result.refreshToken);

    ApiResponse.success(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Login successful');
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is missing');
    }

    const result = await authService.refreshTokens(refreshToken, getSessionMeta(req));

    setRefreshCookie(res, result.refreshToken);

    ApiResponse.success(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Tokens refreshed successfully');
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is missing');
    }

    await authService.logout(refreshToken);

    clearRefreshCookie(res);

    ApiResponse.success(res, null, 'Logout successful');
  }
}

export const authHandler = new AuthHandler();
