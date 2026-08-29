import { OtpService } from '../../../src/modules/auth/services/otp.service';
import { PasswordResetRepository } from '../../../src/modules/auth/repositories/password-reset.repository';
import { AuthRepository } from '../../../src/modules/auth/repositories/auth.repository';
import { AppError } from '../../../src/common/errors/app-error';
import { mockUser } from '../../fixtures/user.fixture';

jest.mock('../../../src/modules/auth/repositories/password-reset.repository');
jest.mock('../../../src/modules/auth/repositories/auth.repository');

const MockedPasswordResetRepo = PasswordResetRepository as jest.MockedClass<typeof PasswordResetRepository>;
const MockedAuthRepo = AuthRepository as jest.MockedClass<typeof AuthRepository>;

const makeResetRecord = (overrides: Record<string, unknown> = {}) => ({
  _id: 'reset-id',
  userId: 'user-id',
  email: 'test@example.com',
  otp: '123456',
  expiresAt: new Date(Date.now() + 600_000), // 10 min future
  attempts: 0,
  isUsed: false,
  createdAt: new Date(),
  ...overrides,
});

describe('OtpService', () => {
  let service: OtpService;
  let passwordResetRepoMock: jest.Mocked<PasswordResetRepository>;
  let authRepoMock: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    passwordResetRepoMock = new MockedPasswordResetRepo() as jest.Mocked<PasswordResetRepository>;
    authRepoMock = new MockedAuthRepo() as jest.Mocked<AuthRepository>;
    service = new OtpService(passwordResetRepoMock, authRepoMock);
  });

  // ── generateAndStoreOtp ──────────────────────────────────
  describe('generateAndStoreOtp', () => {
    it('should generate a 6-digit numeric OTP when user exists', async () => {
      const user = mockUser();
      authRepoMock.findByEmail.mockResolvedValue(user);
      passwordResetRepoMock.create.mockResolvedValue(makeResetRecord() as never);

      const { otp } = await service.generateAndStoreOtp(user.email);

      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
      expect(passwordResetRepoMock.create).toHaveBeenCalledWith(
        expect.any(String),
        user.email,
        otp,
        expect.any(Date),
      );
    });

    it('should throw AppError.notFound when email does not exist', async () => {
      authRepoMock.findByEmail.mockResolvedValue(null);

      await expect(
        service.generateAndStoreOtp('nobody@example.com'),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw 404 when email does not exist', async () => {
      authRepoMock.findByEmail.mockResolvedValue(null);

      await expect(
        service.generateAndStoreOtp('nobody@example.com'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── validateOtp ──────────────────────────────────────────
  describe('validateOtp', () => {
    it('should return the reset record when OTP matches and is valid', async () => {
      const record = makeResetRecord();
      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record as never);

      const result = await service.validateOtp('test@example.com', '123456');

      expect(result).toEqual(record);
      expect(passwordResetRepoMock.incrementAttempts).not.toHaveBeenCalled();
    });

    it('should throw and increment attempts when OTP does not match', async () => {
      const record = makeResetRecord({ otp: '999999' });
      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record as never);
      passwordResetRepoMock.incrementAttempts.mockResolvedValue(undefined);

      await expect(
        service.validateOtp('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
      expect(passwordResetRepoMock.incrementAttempts).toHaveBeenCalledWith('reset-id');
    });

    it('should throw when OTP is expired', async () => {
      const record = makeResetRecord({ expiresAt: new Date(Date.now() - 1000) });
      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record as never);

      await expect(
        service.validateOtp('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw when max attempts are exceeded', async () => {
      const record = makeResetRecord({ attempts: 5 });
      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record as never);

      await expect(
        service.validateOtp('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw when no active reset record exists', async () => {
      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(null);

      await expect(
        service.validateOtp('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  // ── consumeOtp ───────────────────────────────────────────
  describe('consumeOtp', () => {
    it('should mark the record as used', async () => {
      passwordResetRepoMock.markAsUsed.mockResolvedValue(undefined);

      await service.consumeOtp('reset-id');

      expect(passwordResetRepoMock.markAsUsed).toHaveBeenCalledWith('reset-id');
    });
  });
});
