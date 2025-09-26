import { Router } from 'express';
import authRoutes from '../modules/auth/controllers/routes';
import userRoutes from '../modules/users/controllers/routes';
import laneRoutes from '../modules/lanes/controllers/routes';
import calendarRoutes from '../modules/calendar/controllers/routes';
import notesRoutes from '../modules/notes/controllers/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/lanes', laneRoutes);
router.use('/calendar', calendarRoutes);
router.use('/notes', notesRoutes);

export default router;
