import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
}
