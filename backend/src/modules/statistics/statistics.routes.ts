import { Router } from 'express';
import { asyncHandler } from '../../common/utils/async-handler';
import { authenticate } from '../../common/middleware/auth.middleware';
import { getStatistics } from './statistics.controller';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getStatistics));

export default router;
