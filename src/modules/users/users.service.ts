import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Get user by ID with populated data
   * Using lean() to reduce memory footprint and limiting population
   */
  async findById(id: string) {
    return this.userModel
      .findById(id)
      .populate({ path: 'posts', options: { limit: 50, sort: { createdAt: -1 } }, select: 'title createdAt' })
      .populate({ path: 'reviews', options: { limit: 50, sort: { createdAt: -1 } }, select: 'reply createdAt' })
      .populate({ path: 'favour', options: { limit: 50 }, select: 'title' })
      .populate({ path: 'friendList', select: 'username' })
      .lean();
  }

  /**
   * Update user introduction
   */
  async updateIntro(id: string, intro: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.intro = intro;
    await user.save();
    return user;
  }

  /**
   * Get all users (for friend list)
   */
  async findAll() {
    return this.userModel.find().select('username email');
  }
}
