import { signAccessToken, signRefreshToken } from '../../../common/utils/token';
import { AuthTokens } from '../auth.types';

export class SessionService {
  generateTokens(userId: string, email: string): AuthTokens {
    const payload = { userId, email };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }
}
