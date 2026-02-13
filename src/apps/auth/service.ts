import bcrypt from 'bcrypt';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { prisma } from '@libs/shared/db/index.js';
import { config } from '@libs/shared/config/index.js';
import { ConflictError, UnauthorizedError } from '@libs/shared/errors/index.js';
import { logger } from '@libs/shared/logger/index.js';
import type { JwtPayload } from '@libs/shared/middleware/index.js';
import type { RegisterDto, LoginDto, AuthResponseDto } from './dto.js';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = '30d';

interface RefreshTokenPayload extends JwtPayload {
  sessionId: string;
}

interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

interface SessionMeta {
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  async register(data: RegisterDto, meta: SessionMeta): Promise<AuthResponseDto & { refreshToken: string }> {
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.users.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const tokens = await this.createSession(user.id, user.email, meta);

    logger.info({ userId: user.id }, 'User registered successfully');

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(data: LoginDto, meta: SessionMeta): Promise<AuthResponseDto & { refreshToken: string }> {
    const user = await prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await this.createSession(user.id, user.email, meta);

    logger.info({ userId: user.id }, 'User logged in successfully');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshTokens(refreshToken: string, meta: SessionMeta): Promise<AuthResponseDto & { refreshToken: string }> {
    const decoded = this.verifyRefreshToken(refreshToken);

    const session = await prisma.sessions.findUnique({
      where: { id: decoded.sessionId },
      include: { users: { select: { id: true, email: true, name: true } } },
    });

    if (!session) {
      throw new UnauthorizedError('Refresh token is invalid or has been revoked');
    }

    const matches = await bcrypt.compare(refreshToken, session.refresh_token);

    if (!matches) {
      // Possible token theft: revoke ALL sessions for this user
      await prisma.sessions.deleteMany({
        where: { user_id: session.user_id },
      });
      logger.warn({ userId: session.user_id }, 'Refresh token reuse detected – all sessions revoked');
      throw new UnauthorizedError('Refresh token reuse detected. Please log in again.');
    }

    // Delete the old session (rotation)
    await prisma.sessions.delete({ where: { id: session.id } });

    // Create a new session
    const tokens = await this.createSession(session.users.id, session.users.email, meta);

    logger.info({ userId: session.users.id }, 'Tokens refreshed successfully');

    return {
      user: {
        id: session.users.id,
        email: session.users.email,
        name: session.users.name,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    let decoded: RefreshTokenPayload;

    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret as Secret) as RefreshTokenPayload;
    } catch {
      // For logout we don't expose details; just treat as unauthorized.
      throw new UnauthorizedError('Invalid refresh token');
    }

    const session = await prisma.sessions.findUnique({
      where: { id: decoded.sessionId },
    });

    if (!session) {
      // Idempotent: no active session to revoke.
      return;
    }

    const matches = await bcrypt.compare(refreshToken, session.refresh_token);

    if (!matches) {
      // Token does not match current session; treat as already rotated / logged out.
      return;
    }

    await prisma.sessions.delete({ where: { id: session.id } });

    logger.info({ userId: session.user_id, sessionId: session.id }, 'User logged out and session revoked');
  }

  /**
   * Creates a new session row and returns the access + refresh tokens.
   */
  private async createSession(userId: string, email: string, meta: SessionMeta): Promise<TokenResult> {
    // Create a placeholder session to get an ID
    const session = await prisma.sessions.create({
      data: {
        user_id: userId,
        refresh_token: '', // will be updated immediately
        user_agent: meta.userAgent ?? null,
        ip_address: meta.ipAddress ?? null,
      },
    });

    const accessToken = this.generateAccessToken(userId, email);
    const refreshToken = this.generateRefreshToken(userId, email, session.id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await prisma.sessions.update({
      where: { id: session.id },
      data: { refresh_token: hashedRefreshToken },
    });

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email };
    const secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, secret, options);
  }

  private generateRefreshToken(userId: string, email: string, sessionId: string): string {
    const payload: RefreshTokenPayload = { userId, email, sessionId };
    const secret = config.jwt.refreshSecret as Secret;
    const options: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    };

    return jwt.sign(payload, secret, options);
  }

  private verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret as Secret) as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }
}

export const authService = new AuthService();
