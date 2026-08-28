import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { UserModel } from '../../src/modules/auth/models/user.model';
import { hashPassword } from '../../src/common/utils/password';

const MONGO_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/music_test';

describe('Auth API — Integration', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const hashed = await hashPassword('Test@1234');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'Test@1234' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tokens');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('user@example.com');
    });

    it('should return 401 for wrong password', async () => {
      const hashed = await hashPassword('Test@1234');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@example.com', password: 'Test@1234' });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: 'Test@1234' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should send OTP for valid email', async () => {
      const hashed = await hashPassword('Test@1234');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'user@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for unknown email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nobody@example.com' });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const hashed = await hashPassword('Test@1234');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      // Login first
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'Test@1234' });

      const token = loginRes.body.data.tokens.accessToken;

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('user@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
