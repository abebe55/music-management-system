import { IUser } from '../../src/modules/auth/auth.types';

export const mockUser = (overrides: Partial<IUser> = {}): IUser =>
  ({
    _id: 'user-id-123',
    id: 'user-id-123',
    email: 'test@example.com',
    password: '$2a$12$hashedPasswordHere',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  } as unknown as IUser);

export const validLoginPayload = {
  email: 'test@example.com',
  password: 'Test@1234',
};

export const validRegisterPayload = {
  email: 'newuser@example.com',
  password: 'NewUser@1234',
};
