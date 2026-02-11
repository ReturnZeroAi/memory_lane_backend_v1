import { Router } from 'express';
import { lanesHandler } from './handler.js';
import { authMiddleware, validateRequest, asyncHandler } from '../../libs/shared/middleware/index.js';
import { createLaneSchema, updateLaneSchema, laneParamsSchema } from './validator.js';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  validateRequest({ body: createLaneSchema }),
  asyncHandler(lanesHandler.create.bind(lanesHandler)),
);

router.get(
  '/',
  asyncHandler(lanesHandler.findAll.bind(lanesHandler)),
);

router.get(
  '/:id',
  validateRequest({ params: laneParamsSchema }),
  asyncHandler(lanesHandler.findById.bind(lanesHandler)),
);

router.patch(
  '/:id',
  validateRequest({ params: laneParamsSchema, body: updateLaneSchema }),
  asyncHandler(lanesHandler.update.bind(lanesHandler)),
);

router.delete(
  '/:id',
  validateRequest({ params: laneParamsSchema }),
  asyncHandler(lanesHandler.delete.bind(lanesHandler)),
);

export { router as lanesRoutes };
