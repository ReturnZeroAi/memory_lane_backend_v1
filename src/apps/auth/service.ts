import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../libs/shared/db/index.js';
import { config } from '../../libs/shared/config/index.js';
import { ConflictError, UnauthorizedError } from '../../libs/shared/errors/index.js';
import { logger } from '../../libs/shared/logger/index.js';
import type { RegisterDto, LoginDto, AuthResponseDto } from './dto.js';

const SALT_ROUNDS = 12;

export class AuthService {
  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = this.generateToken(user.id, user.email);

    logger.info({ userId: user.id }, 'User registered successfully');

    return { user, token };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email);

    logger.info({ userId: user.id }, 'User logged in successfully');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );
  }
}

export const authService = new AuthService();
