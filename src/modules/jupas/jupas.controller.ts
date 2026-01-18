import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JupasService } from './jupas.service';

@ApiTags('JUPAS & Shrine')
@Controller('jupas')
export class JupasController {
  constructor(private jupasService: JupasService) {}

  // JUPAS endpoints
  @Get('code')
  @ApiOperation({ summary: 'Search JUPAS programs' })
  @ApiResponse({ status: 200, description: 'List of JUPAS programs' })
  async searchJupas(@Query() query: any) {
    return this.jupasService.searchJupas(query);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get 10 most recent JUPAS records' })
  @ApiResponse({ status: 200, description: 'Recent JUPAS records' })
  async getRecentJupas() {
    return this.jupasService.getRecentJupas();
  }

  @Post('code')
  @ApiOperation({ summary: 'Create JUPAS record' })
  @ApiResponse({ status: 201, description: 'JUPAS record created' })
  async createJupas(@Body() data: any) {
    return this.jupasService.createJupas(data);
  }

  @Patch('code')
  @ApiOperation({ summary: 'Update JUPAS like/dislike' })
  @ApiResponse({ status: 200, description: 'Votes updated' })
  async updateJupasVotes(@Body() body: { id: string; like: boolean }) {
    return this.jupasService.updateJupasVotes(body.id, body.like);
  }

  // Shrine endpoints
  @Get('getShrine')
  @ApiOperation({ summary: 'Get shrines with filters' })
  @ApiResponse({ status: 200, description: 'List of shrines' })
  async getShrines(@Query() query: any) {
    return this.jupasService.getShrines(query);
  }

  @Get(':id/getShrine')
  @ApiOperation({ summary: 'Get single shrine by ID' })
  @ApiResponse({ status: 200, description: 'Shrine data' })
  async getShrine(@Param('id') id: string) {
    return this.jupasService.getShrine(id);
  }

  @Post('createShrine')
  @ApiOperation({ summary: 'Create shrine entry' })
  @ApiResponse({ status: 201, description: 'Shrine created' })
  async createShrine(@Body() data: any) {
    return this.jupasService.createShrine(data);
  }

  @Patch('donateShrine')
  @ApiOperation({ summary: 'Mark shrine as donated' })
  @ApiResponse({ status: 200, description: 'Shrine updated' })
  async donateShrine(@Body() body: { id: string }) {
    return this.jupasService.donateShrine(body.id);
  }
}
