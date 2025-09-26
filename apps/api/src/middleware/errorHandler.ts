import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@common/errors/httpError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
}
