import { Router } from 'express';
import { asyncHandler } from '../../common/utils/async-handler';
import { validate } from '../../common/middleware/validation.middleware';
import { authenticate } from '../../common/middleware/auth.middleware';
import {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
} from './song.controller';
import {
  createSongSchema,
  updateSongSchema,
  songQuerySchema,
} from './song.validation';

const router = Router();

// All song routes require authentication
router.use(authenticate);

router.get('/', validate(songQuerySchema, 'query'), asyncHandler(getSongs));
router.post('/', validate(createSongSchema), asyncHandler(createSong));
router.get('/:id', asyncHandler(getSongById));
router.put('/:id', validate(updateSongSchema), asyncHandler(updateSong));
router.delete('/:id', asyncHandler(deleteSong));

export default router;
