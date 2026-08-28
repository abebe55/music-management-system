import bcrypt from 'bcryptjs';
import { authConfig } from '../../config/auth.config';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
}

export async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
