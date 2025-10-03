import { Router } from 'express';
import authRoutes from '@auth/controllers/routes';
import userRoutes from '@users/controllers/routes';
import laneRoutes from '@lanes/controllers/routes';
import calendarRoutes from '@calendar/controllers/routes';
import notesRoutes from '@notes/controllers/routes';

const router = Router();


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/lanes', laneRoutes);
router.use('/calendar', calendarRoutes);
router.use('/notes', notesRoutes);

export default router;
