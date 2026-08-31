import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { UserModel } from '../../src/modules/auth/models/user.model';
import { SongModel } from '../../src/modules/songs/song.model';
import { hashPassword } from '../../src/common/utils/password';
import { signAccessToken } from '../../src/common/utils/token';
import { validCreateSongPayload } from '../fixtures/song.fixture';
import { connectTestDb, disconnectTestDb } from '../helpers/db';

describe('Songs API — Integration', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await connectTestDb('songs');
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await SongModel.deleteMany({});
    await UserModel.deleteMany({});

    const hashed = await hashPassword('Test@1234!');
    const user = await UserModel.create({ email: 'test@songs.com', password: hashed });
    userId = String(user._id);
    authToken = signAccessToken({ userId, email: 'test@songs.com' });
  });

  // ── POST /api/v1/songs ─────────────────────────────────────
  describe('POST /api/v1/songs', () => {
    it('should create a song with valid payload', async () => {
      const res = await request(app)
        .post('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCreateSongPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(validCreateSongPayload.title);
      expect(res.body.data.artist).toBe(validCreateSongPayload.artist);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).not.toHaveProperty('_id');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Only title' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/songs')
        .send(validCreateSongPayload);

      expect(res.status).toBe(401);
    });
  });

  // ── Validation edge cases (Task B) ─────────────────────────
  describe('POST /api/v1/songs — validation edge cases', () => {
    it('should return 400 when artist is pure numbers (no letters)', async () => {
      const res = await request(app)
        .post('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...validCreateSongPayload, artist: '4564' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      const details = res.body.error?.details as Array<{ field: string }> | undefined;
      const artistError = details?.find((d) => d.field === 'artist');
      expect(artistError).toBeDefined();
    });

    it('should allow artist names with letters AND numbers (blink-182)', async () => {
      const res = await request(app)
        .post('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...validCreateSongPayload, artist: 'blink-182', title: 'All The Small Things' });

      expect(res.status).toBe(201);
      expect(res.body.data.artist).toBe('blink-182');
    });

    it('should return 409 Conflict for exact duplicate title+artist+album', async () => {
      await request(app)
        .post('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCreateSongPayload);

      const res = await request(app)
        .post('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCreateSongPayload);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.code).toBe('CONFLICT');
    });
  });

  // ── GET /api/v1/songs ──────────────────────────────────────
  describe('GET /api/v1/songs', () => {
    it('should return paginated list of songs', async () => {
      await SongModel.create(validCreateSongPayload);
      await SongModel.create({ ...validCreateSongPayload, title: 'Another Song' });

      const res = await request(app)
        .get('/api/v1/songs')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.pagination).toBeDefined();
      expect(res.body.meta.pagination.total).toBe(2);
    });

    it('should filter songs by genre', async () => {
      await SongModel.create(validCreateSongPayload); // Pop
      await SongModel.create({ ...validCreateSongPayload, title: 'Rock Song', genre: 'Rock' });

      const res = await request(app)
        .get('/api/v1/songs?genre=Rock')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((s: { genre: string }) => s.genre === 'Rock')).toBe(true);
    });

    it('should search songs by title', async () => {
      await SongModel.create(validCreateSongPayload); // "Blinding Lights"
      await SongModel.create({ ...validCreateSongPayload, title: 'Starboy' });

      const res = await request(app)
        .get('/api/v1/songs?search=blinding')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Blinding Lights');
    });
  });

  // ── GET /api/v1/songs/:id ──────────────────────────────────
  describe('GET /api/v1/songs/:id', () => {
    it('should return a song by id', async () => {
      const song = await SongModel.create(validCreateSongPayload);

      const res = await request(app)
        .get(`/api/v1/songs/${song._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(validCreateSongPayload.title);
    });

    it('should return 404 for non-existent song', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/v1/songs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ── PUT /api/v1/songs/:id ──────────────────────────────────
  describe('PUT /api/v1/songs/:id', () => {
    it('should update a song', async () => {
      const song = await SongModel.create(validCreateSongPayload);

      const res = await request(app)
        .put(`/api/v1/songs/${song._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Save Your Tears' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Save Your Tears');
    });
  });

  // ── DELETE /api/v1/songs/:id ───────────────────────────────
  describe('DELETE /api/v1/songs/:id', () => {
    it('should delete a song', async () => {
      const song = await SongModel.create(validCreateSongPayload);

      const res = await request(app)
        .delete(`/api/v1/songs/${song._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);

      const deleted = await SongModel.findById(song._id);
      expect(deleted).toBeNull();
    });
  });
});

