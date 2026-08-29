import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { UserModel } from '../../src/modules/auth/models/user.model';
import { SongModel } from '../../src/modules/songs/song.model';
import { hashPassword } from '../../src/common/utils/password';
import { signAccessToken } from '../../src/common/utils/token';
import { connectTestDb, disconnectTestDb } from '../helpers/db';

describe('Statistics API — Integration', () => {
  let authToken: string;

  beforeAll(async () => {
    await connectTestDb('statistics');
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await SongModel.deleteMany({});
    await UserModel.deleteMany({});

    const hashed = await hashPassword('Test@1234');
    const user = await UserModel.create({ email: 'test@statistics.com', password: hashed });
    authToken = signAccessToken({ userId: String(user._id), email: 'test@statistics.com' });

    await SongModel.insertMany([
      { title: 'Song A', artist: 'Artist 1', album: 'Album X', genre: 'Pop' },
      { title: 'Song B', artist: 'Artist 1', album: 'Album X', genre: 'Pop' },
      { title: 'Song C', artist: 'Artist 2', album: 'Album Y', genre: 'Rock' },
      { title: 'Song D', artist: 'Artist 2', album: 'Album Z', genre: 'Rock' },
      { title: 'Song E', artist: 'Artist 3', album: 'Album W', genre: 'Hip Hop' },
    ]);
  });

  describe('GET /api/v1/statistics', () => {
    it('should return correct totals', async () => {
      const res = await request(app)
        .get('/api/v1/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const { totals } = res.body.data;
      expect(totals.songs).toBe(5);
      expect(totals.artists).toBe(3);
      expect(totals.albums).toBe(4);
      expect(totals.genres).toBe(3);
    });

    it('should return correct genre breakdown', async () => {
      const res = await request(app)
        .get('/api/v1/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      const { byGenre } = res.body.data;
      const pop = byGenre.find((g: { genre: string }) => g.genre === 'Pop');
      const rock = byGenre.find((g: { genre: string }) => g.genre === 'Rock');

      expect(pop?.count).toBe(2);
      expect(rock?.count).toBe(2);
    });

    it('should return artist statistics', async () => {
      const res = await request(app)
        .get('/api/v1/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      const { byArtist } = res.body.data;
      const artist1 = byArtist.find((a: { artist: string }) => a.artist === 'Artist 1');

      expect(artist1?.songCount).toBe(2);
      expect(artist1?.albumCount).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/v1/statistics');
      expect(res.status).toBe(401);
    });

    it('should return empty statistics with no songs', async () => {
      await SongModel.deleteMany({});

      const res = await request(app)
        .get('/api/v1/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.totals.songs).toBe(0);
      expect(res.body.data.byGenre).toHaveLength(0);
    });
  });
});
