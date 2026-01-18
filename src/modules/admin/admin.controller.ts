import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin')
@Controller('admins')
@UseGuards(AuthenticatedGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get users by activity (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users sorted by activity' })
  async getUsersByActivity() {
    return this.adminService.getUsersByActivity();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get users count (Admin only)' })
  @ApiResponse({ status: 200, description: 'User count' })
  async getUsersCount() {
    return this.adminService.getUsersCount();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Set user identity (Admin only)' })
  @ApiResponse({ status: 200, description: 'User identity updated' })
  async setIdentity(
    @Param('id') userId: string,
    @Body() body: { identity: string },
  ) {
    return this.adminService.setIdentity(userId, body.identity);
  }

  @Delete('empty')
  @ApiOperation({ summary: 'Delete empty users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Empty users deleted' })
  async deleteEmptyUsers() {
    return this.adminService.deleteEmptyUsers();
  }
}
