/**
 * Shared test database helpers.
 *
 * Each integration test suite gets its own MongoDB database name
 * (e.g. music_test_auth, music_test_songs) to avoid cross-suite
 * duplicate-key conflicts when Jest runs suites in parallel workers.
 */
import mongoose from 'mongoose';

const BASE_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

/** Strip any existing DB name from the URI and append the given DB name. */
function buildUri(dbName: string): string {
  // Remove trailing slash + optional DB segment
  const base = BASE_URI.replace(/\/[^/?]+(\?.*)?$/, '');
  return `${base}/${dbName}`;
}

export async function connectTestDb(suiteName: string): Promise<void> {
  const dbName = `music_test_${suiteName}`;
  const uri = buildUri(dbName);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  } else if (mongoose.connection.name !== dbName) {
    // Already connected to a different DB — close and reconnect
    await mongoose.connection.close();
    await mongoose.connect(uri);
  }
}

export async function disconnectTestDb(): Promise<void> {
  await mongoose.connection.close();
}

export async function clearCollections(...collectionNames: string[]): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) return;
  for (const name of collectionNames) {
    const coll = db.collection(name);
    await coll.deleteMany({});
  }
}
