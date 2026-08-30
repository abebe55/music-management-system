/**
 * Test database helpers.
 *
 * Integration tests run with --runInBand (serial) so each suite
 * connects, uses, and disconnects its own isolated database in order.
 */
import mongoose from 'mongoose';

/** Extract host+port from any mongodb:// URI. */
function getMongoBase(): string {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/music_management';
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)/);
  return match ? match[1] : 'mongodb://localhost:27017';
}

export async function connectTestDb(suiteName: string): Promise<void> {
  const dbName = `music_test_${suiteName}`;
  const uri = `${getMongoBase()}/${dbName}`;

  // Already connected to the right DB — nothing to do
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.connection.name === dbName
  ) {
    return;
  }

  // Close any stale connection first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    // Brief pause to let MongoDB release the connection cleanly
    await new Promise((r) => setTimeout(r, 200));
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,  // increased from 5s
    socketTimeoutMS: 30000,
    connectTimeoutMS: 15000,
  });
}

export async function disconnectTestDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    // Drop the test database to leave no residue
    try {
      await mongoose.connection.db?.dropDatabase();
    } catch {
      // ignore drop errors
    }
    await mongoose.connection.close();
    // Brief pause before next suite connects
    await new Promise((r) => setTimeout(r, 300));
  }
}
