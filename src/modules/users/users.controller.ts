import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by ID with populated data' })
  @ApiResponse({ status: 200, description: 'User data' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('user/:id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Update user introduction' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateIntro(@Param('id') id: string, @Body() body: { intro: string }) {
    return this.usersService.updateIntro(id, body.intro);
  }

  @Put('user/:id/friend')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Add friend (bidirectional)' })
  @ApiResponse({ status: 200, description: 'Friend added successfully' })
  async addFriend(@Param('id') friendId: string, @Req() req) {
    const userId = req.user._id;
    return this.usersService.addFriend(userId, friendId);
  }

  @Delete('user/:id/friend')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Remove friend (bidirectional)' })
  @ApiResponse({ status: 200, description: 'Friend removed successfully' })
  async removeFriend(@Param('id') friendId: string, @Req() req) {
    const userId = req.user._id;
    return this.usersService.removeFriend(userId, friendId);
  }

  @Put(':id/favour')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Add message to favourites' })
  @ApiResponse({ status: 200, description: 'Favourite added successfully' })
  async addFavour(@Param('id') messageId: string, @Req() req) {
    const userId = req.user._id;
    await this.usersService.addFavour(userId, messageId);
    await this.postsService.toggleFavour(messageId, userId, true);
    return { status: 'success' };
  }

  @Delete(':id/favour')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Remove message from favourites' })
  @ApiResponse({ status: 200, description: 'Favourite removed successfully' })
  async removeFavour(@Param('id') messageId: string, @Req() req) {
    const userId = req.user._id;
    await this.usersService.removeFavour(userId, messageId);
    await this.postsService.toggleFavour(messageId, userId, false);
    return { status: 'success' };
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all users (for friend list)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
