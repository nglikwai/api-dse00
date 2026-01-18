import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Get user by ID with populated data
   */
  async findById(id: string) {
    return this.userModel
      .findById(id)
      .populate('posts')
      .populate('reviews')
      .populate('favour')
      .populate('friendList');
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
