import { IsString, IsOptional, MinLength, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', minLength: 3 })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: '如題', default: '如題' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'DSEJJ' })
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiPropertyOptional({ example: '吹水' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Parent post ID for threading' })
  @IsString()
  @IsOptional()
  post_group?: string;

  @ApiPropertyOptional({ description: 'Dirty word list for client-side checking' })
  @IsArray()
  @IsOptional()
  dirtyWordList?: string[];

  @ApiPropertyOptional({ description: 'Client-side blocked record flag' })
  @IsBoolean()
  @IsOptional()
  hasBlockedRecordInBrowser?: boolean;
}
