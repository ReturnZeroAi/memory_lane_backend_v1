import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { loadConfig } from '../utils/config';

export function securityMiddlewares() {
  const cfg = loadConfig();
  const limiter = rateLimit({
    windowMs: cfg.security.rateLimitWindowMs,
    max: cfg.security.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false
  });

  return [
    helmet(),
    cors({ origin: cfg.cors.origin as any, credentials: cfg.cors.credentials }),
    limiter
  ];
}
