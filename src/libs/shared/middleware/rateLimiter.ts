import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    meta: {
      success: false,
      message: 'Too many requests, please try again later.',
    },
    data: null,
  },
});

/**
 * Stricter rate limiter for auth endpoints (login, register, refresh).
 * 15 requests per 15-minute window per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    meta: {
      success: false,
      message: 'Too many authentication attempts, please try again later.',
    },
    data: null,
  },
});
