import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reply, ReplyDocument } from './schemas/reply.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateReplyDto } from './dto/create-reply.dto';
import { AddNestedReplyDto } from './dto/add-nested-reply.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new reply
   */
  async create(dto: CreateReplyDto, userId?: string) {
    // Validate minimum length
    if (dto.body.length < 3) {
      throw new BadRequestException('Reply must be at least 3 characters');
    }

    const authorId = userId || '622874ccc8ed254d82edf591';

    // Create reply
    const reply = new this.replyModel({
      body: dto.body,
      rating: dto.rating,
      author: authorId,
      post: dto.postId,
    });

    await reply.save();

    // Increment post popular counter
    const post = await this.postModel.findById(dto.postId);
    if (post) {
      post.popular += 1;
      post.reviews.push(reply._id as any);
      await post.save();
    }

    // Add reply to user's reviews array
    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        user.reviews.push(reply._id as any);
        await user.save();
      }
    }

    return { status: 'success', reply };
  }

  /**
   * Delete a reply
   */
  async delete(id: string, userId?: string) {
    const reply = await this.replyModel.findById(id);
    if (!reply) {
      throw new BadRequestException('Reply not found');
    }

    // Remove from post's reviews array
    await this.postModel.updateOne(
      { _id: reply.post },
      { $pull: { reviews: id } },
    );

    // Delete reply
    await this.replyModel.findByIdAndDelete(id);

    return { state: 'success' };
  }

  /**
   * Add nested reply to a reply
   */
  async addNestedReply(dto: AddNestedReplyDto, userId?: string) {
    if (dto.reply.length < 1) {
      throw new BadRequestException('Reply cannot be empty');
    }

    const post = await this.postModel.findById(dto.postId);
    if (post) {
      post.popular += 1;
      await post.save();
    }

    const reply = await this.replyModel.findById(dto.reviewId);
    if (!reply) {
      throw new BadRequestException('Reply not found');
    }

    reply.reply.push(dto.reply);

    const authorName = userId
      ? (await this.userModel.findById(userId))?.username || 'DSEJJ'
      : 'DSEJJ';
    reply.replyAuthor.push(authorName);

    await reply.save();

    return { status: 'success', reply };
  }
}
