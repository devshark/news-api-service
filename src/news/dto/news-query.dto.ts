import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class NewsQueryDto {
  @ApiProperty({ required: true, description: 'Search query for articles' })
  @IsString()
  q: string;

  @ApiProperty({
    required: false,
    description:
      'This parameter allows you to specify the country where the news articles were published',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    required: false,
    description:
      'This parameter allows you to specify the language of the news articles',
  })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiProperty({
    required: false,
    description: 'Number of articles to return',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  max?: number = 10;
}
