import bcrypt from 'bcryptjs';
import User from '../models/User';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../dto/auth.dto';
import { generateToken } from '../utils/jwt';

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      email: data.email,
      password_hash,
      first_name: data.first_name,
      last_name: data.last_name,
    });

    const token = generateToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await User.findOne({ email: data.email });
    if (!user || !user.is_active) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }
}
