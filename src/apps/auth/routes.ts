import { Router } from 'express';
import { authHandler } from './handler.js';
import { validateRequest, asyncHandler, authRateLimiter } from '@libs/shared/middleware/index.js';
import { registerSchema, loginSchema } from './validator.js';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  asyncHandler(authHandler.register.bind(authHandler)),
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  asyncHandler(authHandler.login.bind(authHandler)),
);

router.post(
  '/refresh',
  authRateLimiter,
  asyncHandler(authHandler.refresh.bind(authHandler)),
);

router.post(
  '/logout',
  asyncHandler(authHandler.logout.bind(authHandler)),
);

export { router as authRoutes };
