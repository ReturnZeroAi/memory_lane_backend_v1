import { Router } from 'express';
import { calendarsHandler } from './handler.js';
import { authMiddleware, validateRequest, asyncHandler } from '../../libs/shared/middleware/index.js';
import { createCalendarSchema, updateCalendarSchema, calendarParamsSchema } from './validator.js';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  validateRequest({ body: createCalendarSchema }),
  asyncHandler(calendarsHandler.create.bind(calendarsHandler)),
);

router.get(
  '/',
  asyncHandler(calendarsHandler.findAll.bind(calendarsHandler)),
);

router.get(
  '/:id',
  validateRequest({ params: calendarParamsSchema }),
  asyncHandler(calendarsHandler.findById.bind(calendarsHandler)),
);

router.patch(
  '/:id',
  validateRequest({ params: calendarParamsSchema, body: updateCalendarSchema }),
  asyncHandler(calendarsHandler.update.bind(calendarsHandler)),
);

router.delete(
  '/:id',
  validateRequest({ params: calendarParamsSchema }),
  asyncHandler(calendarsHandler.delete.bind(calendarsHandler)),
);

export { router as calendarsRoutes };
