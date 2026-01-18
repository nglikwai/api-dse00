import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { YylamService } from './yylam.service';

@ApiTags('Yylam')
@Controller('apis/yylam')
export class YylamController {
  constructor(private yylamService: YylamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all yylam records' })
  @ApiResponse({ status: 200, description: 'List of yylam records' })
  async findAll() {
    return this.yylamService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create yylam record' })
  @ApiResponse({ status: 201, description: 'Yylam record created' })
  async create(@Body() data: any) {
    return this.yylamService.create(data);
  }
}
