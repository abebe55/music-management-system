import { UserModel } from '../models/user.model';
import { IUser } from '../auth.types';

export class AuthRepository {
  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return query.lean<IUser>().exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean<IUser>().exec();
  }

  async create(email: string, hashedPassword: string): Promise<IUser> {
    const user = await UserModel.create({ email: email.toLowerCase(), password: hashedPassword });
    return user.toObject() as IUser;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async updateEmail(userId: string, newEmail: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { email: newEmail.toLowerCase() });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}
