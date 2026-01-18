import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      const { hash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async register(username: string, email: string, password: string) {
    if (email.length > 40) {
      throw new BadRequestException('Email too long');
    }

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const user = new this.userModel({ username, email });
    await user.setPassword(password);
    await user.save();

    const { hash, ...result } = user.toObject();
    return result;
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}
