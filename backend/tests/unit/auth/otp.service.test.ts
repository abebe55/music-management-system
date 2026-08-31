import { OtpService } from '../../../src/modules/auth/services/otp.service';
import { PasswordResetRepository } from '../../../src/modules/auth/repositories/password-reset.repository';
import { AppError } from '../../../src/common/errors/app-error';
import * as passwordUtils from '../../../src/common/utils/password';

jest.mock('../../../src/modules/auth/repositories/password-reset.repository');
jest.mock('../../../src/common/utils/password');

const MockedPasswordResetRepo = PasswordResetRepository as jest.MockedClass<typeof PasswordResetRepository>;

/** Build a reset record with a pre-hashed OTP for testing. */
function makeRecord(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'reset-id',
    userId: 'user-id',
    email: 'test@example.com',
    otpHash: '$2a$12$hashedOtpValue',  // bcrypt hash, not plain OTP
    expiresAt: new Date(Date.now() + 600_000),
    attempts: 0,
    isUsed: false,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('OtpService', () => {
  let service: OtpService;
  let repoMock: jest.Mocked<PasswordResetRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repoMock = new MockedPasswordResetRepo() as jest.Mocked<PasswordResetRepository>;
    service = new OtpService(repoMock);
  });

  // ── generateAndStoreOtp ──────────────────────────────────
  describe('generateAndStoreOtp', () => {
    it('should return a 6-digit OTP and store its hash', async () => {
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue('$2a$12$hashedValue');
      repoMock.create.mockResolvedValue(makeRecord() as never);

      const otp = await service.generateAndStoreOtp('user-id', 'test@example.com');

      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
      // Repo should receive the HASH, not the plain OTP
      expect(repoMock.create).toHaveBeenCalledWith(
        'user-id',
        'test@example.com',
        '$2a$12$hashedValue',
        expect.any(Date),
      );
      // hashPassword must have been called with the plain OTP
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith(otp);
    });
  });

  // ── validateOtpAndIssueResetToken ─────────────────────────
  describe('validateOtpAndIssueResetToken', () => {
    it('should return a reset token when OTP matches', async () => {
      const record = makeRecord();
      repoMock.findLatestByEmail.mockResolvedValue(record as never);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      repoMock.setResetToken.mockResolvedValue(undefined);

      const token = await service.validateOtpAndIssueResetToken('test@example.com', '123456');

      expect(token).toHaveLength(64);    // 32 bytes hex = 64 chars
      expect(repoMock.setResetToken).toHaveBeenCalledWith(
        'reset-id',
        token,
        expect.any(Date),
      );
      expect(repoMock.incrementAttempts).not.toHaveBeenCalled();
    });

    it('should increment attempts and throw when OTP does not match', async () => {
      const record = makeRecord();
      repoMock.findLatestByEmail.mockResolvedValue(record as never);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(false);
      repoMock.incrementAttempts.mockResolvedValue(undefined);

      await expect(
        service.validateOtpAndIssueResetToken('test@example.com', '000000'),
      ).rejects.toBeInstanceOf(AppError);
      expect(repoMock.incrementAttempts).toHaveBeenCalledWith('reset-id');
    });

    it('should throw when OTP is expired', async () => {
      const record = makeRecord({ expiresAt: new Date(Date.now() - 1000) });
      repoMock.findLatestByEmail.mockResolvedValue(record as never);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(
        service.validateOtpAndIssueResetToken('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw when max attempts exceeded', async () => {
      const record = makeRecord({ attempts: 5 });
      repoMock.findLatestByEmail.mockResolvedValue(record as never);

      await expect(
        service.validateOtpAndIssueResetToken('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw when no reset record exists', async () => {
      repoMock.findLatestByEmail.mockResolvedValue(null);

      await expect(
        service.validateOtpAndIssueResetToken('test@example.com', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  // ── consumeResetToken ─────────────────────────────────────
  describe('consumeResetToken', () => {
    it('should return userId and mark record used for valid token', async () => {
      const record = makeRecord({
        resetToken: 'valid-token',
        resetTokenExpiresAt: new Date(Date.now() + 900_000),
      });
      repoMock.findByResetToken.mockResolvedValue(record as never);
      repoMock.markAsUsed.mockResolvedValue(undefined);

      const userId = await service.consumeResetToken('valid-token');

      expect(userId).toBe('user-id');
      expect(repoMock.markAsUsed).toHaveBeenCalledWith('reset-id');
    });

    it('should throw for expired reset token', async () => {
      const record = makeRecord({
        resetToken: 'expired-token',
        resetTokenExpiresAt: new Date(Date.now() - 1000),
      });
      repoMock.findByResetToken.mockResolvedValue(record as never);

      await expect(service.consumeResetToken('expired-token')).rejects.toBeInstanceOf(AppError);
    });

    it('should throw for non-existent token', async () => {
      repoMock.findByResetToken.mockResolvedValue(null);

      await expect(service.consumeResetToken('fake')).rejects.toBeInstanceOf(AppError);
    });
  });
});
