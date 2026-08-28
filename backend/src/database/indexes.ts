import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { SongModel } from '../modules/songs/song.model';
import { UserModel } from '../modules/auth/models/user.model';
import { PasswordResetModel } from '../modules/auth/models/password-reset.model';
import { logger } from '../common/utils/logger';

async function ensureIndexes(): Promise<void> {
  await connectDatabase();

  logger.info('Creating indexes...');

  await Promise.all([
    UserModel.syncIndexes(),
    PasswordResetModel.syncIndexes(),
    SongModel.syncIndexes(),
  ]);

  logger.info('Indexes created successfully');
  await disconnectDatabase();
}

ensureIndexes().catch((err) => {
  logger.error('Index creation failed:', err);
  process.exit(1);
});
