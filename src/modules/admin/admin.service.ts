import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Get all users with populated posts and reviews
   */
  async getAllUsers() {
    return this.userModel.find().populate('posts').populate('reviews');
  }

  /**
   * Get users sorted by activity (updatedAt)
   */
  async getUsersByActivity() {
    return this.userModel.find().sort({ updatedAt: -1 });
  }

  /**
   * Set user identity (admin or member)
   */
  async setIdentity(userId: string, identity: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.identity = identity;
    await user.save();
    return user;
  }

  /**
   * Delete empty users (no posts, no reviews)
   */
  async deleteEmptyUsers() {
    const users = await this.userModel.find();
    const emptyUsers = users.filter(
      (user) => user.posts.length === 0 && user.reviews.length === 0,
    );

    const deletePromises = emptyUsers.map((user) =>
      this.userModel.findByIdAndDelete(user._id),
    );

    await Promise.all(deletePromises);
    return { deleted: emptyUsers.length };
  }

  /**
   * Get all users count (removed grade refresh functionality)
   */
  async getUsersCount() {
    const count = await this.userModel.countDocuments();
    return { count };
  }
}
