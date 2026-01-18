import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { AddNestedReplyDto } from './dto/add-nested-reply.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('Replies')
@Controller('reviews')
export class RepliesController {
  constructor(private repliesService: RepliesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reply' })
  @ApiResponse({ status: 201, description: 'Reply created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() dto: CreateReplyDto, @Req() req) {
    const userId = req.user?._id;
    return this.repliesService.create(dto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Delete a reply (authenticated)' })
  @ApiResponse({ status: 200, description: 'Reply deleted successfully' })
  async delete(@Param('id') id: string, @Req() req) {
    const userId = req.user?._id;
    return this.repliesService.delete(id, userId);
  }

  @Post('reply')
  @ApiOperation({ summary: 'Add nested reply to a reply' })
  @ApiResponse({ status: 201, description: 'Nested reply added successfully' })
  async addNestedReply(@Body() dto: AddNestedReplyDto, @Req() req) {
    const userId = req.user?._id;
    return this.repliesService.addNestedReply(dto, userId);
  }
}
