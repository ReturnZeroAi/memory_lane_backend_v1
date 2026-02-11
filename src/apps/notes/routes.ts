import { Router } from 'express';
import { notesHandler } from './handler.js';
import { authMiddleware, validateRequest, asyncHandler } from '../../libs/shared/middleware/index.js';
import { createNoteSchema, updateNoteSchema, noteParamsSchema, noteListQuerySchema } from './validator.js';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  validateRequest({ body: createNoteSchema }),
  asyncHandler(notesHandler.create.bind(notesHandler)),
);

router.get(
  '/',
  validateRequest({ query: noteListQuerySchema }),
  asyncHandler(notesHandler.findAll.bind(notesHandler)),
);

router.get(
  '/:id',
  validateRequest({ params: noteParamsSchema }),
  asyncHandler(notesHandler.findById.bind(notesHandler)),
);

router.patch(
  '/:id',
  validateRequest({ params: noteParamsSchema, body: updateNoteSchema }),
  asyncHandler(notesHandler.update.bind(notesHandler)),
);

router.delete(
  '/:id',
  validateRequest({ params: noteParamsSchema }),
  asyncHandler(notesHandler.delete.bind(notesHandler)),
);

export { router as notesRoutes };
