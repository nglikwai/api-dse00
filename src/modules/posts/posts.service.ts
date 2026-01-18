import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { ModerationService } from '../moderation/moderation.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private moderationService: ModerationService,
  ) {}

  async findAll(query: QueryPostDto) {
    const { page = 1, limit = 150, category, user, date_after } = query;

    const filter: any = {};
    if (category) filter.category = category;
    if (user) filter.display_name = user;
    if (date_after) filter.createdAt = { $gte: new Date(date_after) };

    const options = {
      page,
      limit,
      sort: { updatedAt: -1 },
      populate: [
        { path: 'author', select: 'username' },
        { path: 'reviews' },
      ],
    };

    // @ts-ignore - mongoose-paginate-v2 adds paginate method
    const data = await this.postModel.paginate(filter, options);
    return data.docs;
  }

  async create(dto: CreatePostDto, ip: string, userId?: string) {
    if (dto.title.length < 3) {
      throw new BadRequestException('Title must be at least 3 characters');
    }

    const isValid = await this.moderationService.validateMessage(
      dto.title,
      dto.description || '',
      dto.display_name,
      ip,
      dto.hasBlockedRecordInBrowser || false,
    );

    if (!isValid) {
      return { blockUser: true };
    }

    const post = new this.postModel({
      title: dto.title,
      description: dto.description || '如題',
      display_name: dto.display_name,
      category: dto.category || '吹水',
      post_group: dto.post_group,
      ip,
      author: userId || '622874ccc8ed254d82edf591',
    });

    if (dto.post_group) {
      const parentTopic = await this.postModel.findById(dto.post_group);
      if (parentTopic) {
        post.category = parentTopic.category;
      }
    }

    await post.save();
    return { status: 'success', post };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      return null;
    }

    const data = await this.postModel
      .find({
        $or: [
          { _id: id },
          { _id: post.post_group || null },
          { post_group: post.post_group || id },
        ],
      })
      .sort('createdAt');

    return data;
  }

  async delete(id: string, userId?: string) {
    await this.postModel.findByIdAndDelete(id);
    return { state: 'success' };
  }

  async incrementPopular(id: string, amount: number = 1) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.popular += amount;
    await post.save();

    return { status: 'success', post };
  }

  async toggleFavour(postId: string, userId: string, add: boolean) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    if (add) {
      post.favour += 1;
    } else {
      post.favour = Math.max(0, post.favour - 1);
    }

    await post.save();
    return post;
  }
}
