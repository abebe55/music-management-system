import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import songRoutes from '../modules/songs/song.routes';
import statisticsRoutes from '../modules/statistics/statistics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/songs', songRoutes);
router.use('/statistics', statisticsRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

export default router;
