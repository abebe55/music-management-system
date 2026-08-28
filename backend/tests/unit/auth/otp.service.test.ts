import { OtpService } from '../../../src/modules/auth/services/otp.service';
import { PasswordResetRepository } from '../../../src/modules/auth/repositories/password-reset.repository';
import { AuthRepository } from '../../../src/modules/auth/repositories/auth.repository';
import { AppError } from '../../../src/common/errors/app-error';
import { mockUser } from '../../fixtures/user.fixture';

jest.mock('../../../src/modules/auth/repositories/password-reset.repository');
jest.mock('../../../src/modules/auth/repositories/auth.repository');

const MockedPasswordResetRepo = PasswordResetRepository as jest.MockedClass<typeof PasswordResetRepository>;
const MockedAuthRepo = AuthRepository as jest.MockedClass<typeof AuthRepository>;

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

  describe('generateAndStoreOtp', () => {
    it('should generate OTP when user exists', async () => {
      const user = mockUser();
      authRepoMock.findByEmail.mockResolvedValue(user);
      passwordResetRepoMock.updateMany = jest.fn().mockResolvedValue(undefined);
      passwordResetRepoMock.create.mockResolvedValue({
        _id: 'reset-id',
        userId: user._id,
        email: user.email,
        otp: '123456',
        expiresAt: new Date(Date.now() + 600000),
        attempts: 0,
        isUsed: false,
        createdAt: new Date(),
      } as never);

      const result = await service.generateAndStoreOtp(user.email);

      expect(result.otp).toHaveLength(6);
      expect(/^\d{6}$/.test(result.otp)).toBe(true);
    });

    it('should throw NOT_FOUND when user email does not exist', async () => {
      authRepoMock.findByEmail.mockResolvedValue(null);

      await expect(service.generateAndStoreOtp('nobody@example.com')).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('validateOtp', () => {
    it('should return reset record when OTP is valid', async () => {
      const record = {
        _id: 'reset-id',
        userId: 'user-id',
        email: 'test@example.com',
        otp: '123456',
        expiresAt: new Date(Date.now() + 600000), // future
        attempts: 0,
        isUsed: false,
        createdAt: new Date(),
      } as never;

      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record);

      const result = await service.validateOtp('test@example.com', '123456');

      expect(result).toEqual(record);
      expect(passwordResetRepoMock.incrementAttempts).not.toHaveBeenCalled();
    });

    it('should throw when OTP does not match', async () => {
      const record = {
        _id: 'reset-id',
        email: 'test@example.com',
        otp: '999999',
        expiresAt: new Date(Date.now() + 600000),
        attempts: 0,
        isUsed: false,
      } as never;

      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record);
      passwordResetRepoMock.incrementAttempts.mockResolvedValue(undefined);

      await expect(service.validateOtp('test@example.com', '123456')).rejects.toBeInstanceOf(AppError);
      expect(passwordResetRepoMock.incrementAttempts).toHaveBeenCalled();
    });

    it('should throw when OTP is expired', async () => {
      const record = {
        _id: 'reset-id',
        email: 'test@example.com',
        otp: '123456',
        expiresAt: new Date(Date.now() - 1000), // past
        attempts: 0,
        isUsed: false,
      } as never;

      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record);

      await expect(service.validateOtp('test@example.com', '123456')).rejects.toBeInstanceOf(AppError);
    });

    it('should throw when max attempts exceeded', async () => {
      const record = {
        _id: 'reset-id',
        email: 'test@example.com',
        otp: '123456',
        expiresAt: new Date(Date.now() + 600000),
        attempts: 5,
        isUsed: false,
      } as never;

      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(record);

      await expect(service.validateOtp('test@example.com', '123456')).rejects.toBeInstanceOf(AppError);
    });

    it('should throw when no reset record found', async () => {
      passwordResetRepoMock.findLatestByEmail.mockResolvedValue(null);

      await expect(service.validateOtp('test@example.com', '123456')).rejects.toBeInstanceOf(AppError);
    });
  });
});
