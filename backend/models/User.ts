import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export interface IUser extends Document {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.MEMBER },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
