import { AuthService } from '../../../src/modules/auth/auth.service';
import { AuthRepository } from '../../../src/modules/auth/repositories/auth.repository';
import { PasswordResetRepository } from '../../../src/modules/auth/repositories/password-reset.repository';
import { AppError } from '../../../src/common/errors/app-error';
import { mockUser } from '../../fixtures/user.fixture';
import * as passwordUtils from '../../../src/common/utils/password';

jest.mock('../../../src/modules/auth/repositories/auth.repository');
jest.mock('../../../src/modules/auth/repositories/password-reset.repository');
jest.mock('../../../src/modules/auth/services/email.service');
jest.mock('../../../src/common/utils/password');

const MockedAuthRepo = AuthRepository as jest.MockedClass<typeof AuthRepository>;

describe('AuthService', () => {
  let service: AuthService;
  let authRepoMock: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();
    authRepoMock = MockedAuthRepo.mock.instances[0] as jest.Mocked<AuthRepository>;
  });

  describe('login', () => {
    it('should return tokens and user on valid credentials', async () => {
      const user = mockUser({ email: 'test@example.com' });
      authRepoMock.findByEmail.mockResolvedValue(user);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: 'test@example.com', password: 'Test@1234!' });

      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('user');
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UNAUTHORIZED when user is not found', async () => {
      authRepoMock.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'Test@1234!' }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw UNAUTHORIZED when password is wrong', async () => {
      const user = mockUser();
      authRepoMock.findByEmail.mockResolvedValue(user);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'WrongPassword' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
