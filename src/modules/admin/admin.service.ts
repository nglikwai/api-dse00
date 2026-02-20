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
   * Get all users with counts instead of full populated data
   * This prevents loading entire database into memory
   */
  async getAllUsers(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    return this.userModel
      .find()
      .select('username email identity createdAt updatedAt')
      .skip(skip)
      .limit(limit)
      .lean();
  }

  /**
   * Get users sorted by activity (updatedAt) with pagination
   */
  async getUsersByActivity(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    return this.userModel
      .find()
      .select('username email identity updatedAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
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
   * Uses database query instead of loading all users into memory
   */
  async deleteEmptyUsers() {
    const result = await this.userModel.deleteMany({
      $and: [
        { $or: [{ posts: { $exists: false } }, { posts: { $size: 0 } }] },
        { $or: [{ reviews: { $exists: false } }, { reviews: { $size: 0 } }] },
      ],
    });
    return { deleted: result.deletedCount };
  }

  /**
   * Get all users count (removed grade refresh functionality)
   */
  async getUsersCount() {
    const count = await this.userModel.countDocuments();
    return { count };
  }
}
