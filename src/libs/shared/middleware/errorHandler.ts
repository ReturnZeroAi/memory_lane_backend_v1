import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { Prisma } from '@generated/prisma/client.js';
import { AppError, ValidationError } from '../errors/index.js';
import { ApiResponse } from '../response/index.js';
import { logger } from '../logger/index.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    ApiResponse.error(res, 'Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, formatted);
    return;
  }

  // Custom validation errors with extra data
  if (err instanceof ValidationError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err }, 'Non-operational error caught');
    }
    ApiResponse.error(res, err.message, err.statusCode);
    return;
  }

  // Prisma known request errors (e.g. unique constraint)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error({ err, code: err.code }, 'Prisma known request error');

    if (err.code === 'P2002') {
      ApiResponse.error(res, 'A record with this value already exists', StatusCodes.CONFLICT);
      return;
    }
    if (err.code === 'P2025') {
      ApiResponse.error(res, 'Record not found', StatusCodes.NOT_FOUND);
      return;
    }

    ApiResponse.error(res, 'Database error', StatusCodes.BAD_REQUEST);
    return;
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error({ err }, 'Prisma validation error');
    ApiResponse.error(res, 'Invalid data provided', StatusCodes.BAD_REQUEST);
    return;
  }

  // Unknown / unhandled errors
  logger.error({ err }, 'Unhandled error');
  ApiResponse.error(
    res,
    'An unexpected error occurred',
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}
