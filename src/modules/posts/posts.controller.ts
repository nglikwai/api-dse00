import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { PostThrottleGuard } from './guards/post-throttle.guard';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  @ApiOperation({ summary: 'Get all posts with filters' })
  @ApiResponse({ status: 200, description: 'List of posts' })
  async findAll(@Query() query: QueryPostDto) {
    return this.postsService.findAll(query);
  }

  @Post()
  @UseGuards(PostThrottleGuard)
  @Throttle({ default: { ttl: 1000, limit: 1 } })
  @ApiOperation({ summary: 'Create a new post (rate limited: 1/sec)' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 400, description: 'Content blocked or invalid' })
  async create(@Body() dto: CreatePostDto, @Req() req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userId = req.user?._id;
    return this.postsService.create(dto, ip, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID with threading' })
  @ApiResponse({ status: 200, description: 'Post with thread' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete()
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Delete post (authenticated)' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  async delete(@Query('id') id: string) {
    return this.postsService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Increment popular counter' })
  @ApiResponse({ status: 200, description: 'Popular counter updated' })
  async addPopular(@Param('id') id: string, @Query('popular') popular: string) {
    const amount = parseInt(popular) || 1;
    return this.postsService.incrementPopular(id, amount);
  }
}
