import { Router } from 'express';
import { authHandler } from './handler.js';
import { validateRequest, asyncHandler } from '../../libs/shared/middleware/index.js';
import { registerSchema, loginSchema } from './validator.js';

const router = Router();

router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  asyncHandler(authHandler.register.bind(authHandler)),
);

router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  asyncHandler(authHandler.login.bind(authHandler)),
);

export { router as authRoutes };
