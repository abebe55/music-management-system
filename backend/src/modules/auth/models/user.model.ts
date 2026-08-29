import mongoose, { Schema } from 'mongoose';
import { IUser } from '../auth.types';
import { AuthConstants } from '../../../common/constants/auth.constants';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: AuthConstants.EMAIL_MAX_LENGTH,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: AuthConstants.PASSWORD_MIN_LENGTH,
      select: false, // exclude by default
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = (ret['_id'] as { toString(): string }).toString();
        delete ret['_id'];
        delete ret['password'];
        return ret;
      },
    },
  },
);

// Index is already declared via `unique: true` on the schema field above
// — do not add a duplicate here

export const UserModel = mongoose.model<IUser>('User', userSchema);
