import { IsString, MinLength, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({ example: 'This is my reply', minLength: 3 })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Message ID' })
  @IsString()
  @IsNotEmpty()
  postId: string;
}
