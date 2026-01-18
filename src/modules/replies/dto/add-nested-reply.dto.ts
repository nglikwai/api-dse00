import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddNestedReplyDto {
  @ApiProperty({ example: 'This is a nested reply', minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  reply: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Post ID' })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Review/Reply ID' })
  @IsString()
  @IsNotEmpty()
  reviewId: string;
}
