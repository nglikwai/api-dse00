import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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
   * Add friend (bidirectional)
   */
  async addFriend(userId: string, friendId: string) {
    const [user, friend] = await Promise.all([
      this.userModel.findById(userId),
      this.userModel.findById(friendId),
    ]);

    if (!user || !friend) {
      throw new BadRequestException('User not found');
    }

    // Add to both friendLists (if not already friends)
    if (!user.friendList.includes(friendId as any)) {
      user.friendList.unshift(friendId as any);
    }
    if (!friend.friendList.includes(userId as any)) {
      friend.friendList.unshift(userId as any);
    }

    await Promise.all([user.save(), friend.save()]);
    return { user, friend };
  }

  /**
   * Remove friend (bidirectional)
   */
  async removeFriend(userId: string, friendId: string) {
    const [user, friend] = await Promise.all([
      this.userModel.findById(userId),
      this.userModel.findById(friendId),
    ]);

    if (!user || !friend) {
      throw new BadRequestException('User not found');
    }

    // Remove from both lists
    const userIndex = user.friendList.findIndex(
      (id) => id.toString() === friendId,
    );
    const friendIndex = friend.friendList.findIndex(
      (id) => id.toString() === userId,
    );

    if (userIndex > -1) user.friendList.splice(userIndex, 1);
    if (friendIndex > -1) friend.friendList.splice(friendIndex, 1);

    await Promise.all([user.save(), friend.save()]);
    return { user, friend };
  }

  /**
   * Add favourite message
   */
  async addFavour(userId: string, messageId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.favour.includes(messageId as any)) {
      user.favour.push(messageId as any);
      await user.save();
    }

    return user;
  }

  /**
   * Remove favourite message
   */
  async removeFavour(userId: string, messageId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const index = user.favour.findIndex((id) => id.toString() === messageId);
    if (index > -1) {
      user.favour.splice(index, 1);
      await user.save();
    }

    return user;
  }

  /**
   * Get all users (for friend list)
   */
  async findAll() {
    return this.userModel.find().select('username email');
  }
}
