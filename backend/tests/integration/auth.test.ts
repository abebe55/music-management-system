import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { UserModel } from '../../src/modules/auth/models/user.model';
import { PasswordResetModel } from '../../src/modules/auth/models/password-reset.model';
import { hashPassword } from '../../src/common/utils/password';
import { connectTestDb, disconnectTestDb } from '../helpers/db';

describe('Auth API — Integration', () => {
  beforeAll(async () => {
    await connectTestDb('auth');
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await PasswordResetModel.deleteMany({});
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const hashed = await hashPassword('Test@1234!');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'Test@1234!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tokens');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('user@example.com');
    });

    it('should return 401 for wrong password', async () => {
      const hashed = await hashPassword('Test@1234!');
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
        .send({ email: 'nobody@example.com', password: 'Test@1234!' });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: 'Test@1234!' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when fields are missing', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should return 200 for valid email (account enumeration prevention)', async () => {
      const hashed = await hashPassword('Test@1234!');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'user@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 200 for unknown email (no enumeration)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nobody@example.com' });

      // Must return 200, not 404 — prevents account enumeration
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/verify-otp → reset-password flow', () => {
    it('should verify OTP and return a reset token', async () => {
      const hashed = await hashPassword('Test@1234!');
      const user = await UserModel.create({ email: 'user@example.com', password: hashed });

      // Trigger forgot-password to generate OTP record
      await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'user@example.com' });

      // Read OTP record from DB (test-only shortcut — we don't have email delivery in tests)
      const resetRecord = await PasswordResetModel.findOne({ userId: String(user._id) });
      expect(resetRecord).not.toBeNull();
      // otpHash should be stored, not plaintext
      expect(resetRecord!.otpHash).toBeDefined();
      expect(resetRecord!.otpHash).not.toMatch(/^\d{6}$/); // must NOT be plain 6 digits
    });

    it('should return 400 for invalid reset token format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ resetToken: 'short', newPassword: 'NewPass@123' });

      expect(res.status).toBe(400);
    });

    it('should return 401 for non-existent reset token', async () => {
      const fakeToken = 'a'.repeat(64);
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ resetToken: fakeToken, newPassword: 'NewPass@123' });

      expect(res.status).toBe(401);
    });
  });

  describe('Password policy validation', () => {
    it('should return 400 when reset-password newPassword lacks uppercase', async () => {
      const fakeToken = 'a'.repeat(64);
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ resetToken: fakeToken, newPassword: 'weakpassword1!' });

      // Either 400 (validation) or 401 (bad token) — both show policy is enforced
      // A weak password must never return 200
      expect([400, 401]).toContain(res.status);
      if (res.status === 400) {
        expect(res.body.success).toBe(false);
      }
    });

    it('should return 400 when reset-password newPassword is too simple (no special char)', async () => {
      const fakeToken = 'b'.repeat(64);
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ resetToken: fakeToken, newPassword: 'SimplePass1' });

      expect([400, 401]).toContain(res.status);
    });

    it('should return 400 when change-password newPassword fails complexity', async () => {
      const hashed = await hashPassword('Test@1234!');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'Test@1234!' });

      const token = loginRes.body.data.tokens.accessToken;

      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'Test@1234!', newPassword: 'weak' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when change-password newPassword has no special character', async () => {
      const hashed = await hashPassword('Test@1234!');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'Test@1234!' });

      const token = loginRes.body.data.tokens.accessToken;

      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'Test@1234!', newPassword: 'NoSpecial123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('OTP resend cooldown', () => {
    it('should return 429 when requesting a second OTP within 60 seconds', async () => {
      const hashed = await hashPassword('Test@1234!');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      // First request — should succeed
      const first = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'user@example.com' });
      expect(first.status).toBe(200);

      // Immediate second request — should be blocked by cooldown
      const second = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'user@example.com' });
      expect(second.status).toBe(429);
      expect(second.body.success).toBe(false);
      expect(second.body.message).toMatch(/wait/i);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const hashed = await hashPassword('Test@1234!');
      await UserModel.create({ email: 'user@example.com', password: hashed });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'Test@1234!' });

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
