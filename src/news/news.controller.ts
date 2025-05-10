import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewsQueryDto } from './dto/news-query.dto';
import { NewsResponse, Article } from './interfaces/news.interface';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get news articles with optional filtering' })
  @ApiResponse({ status: 200, description: 'Returns news articles' })
  async getArticles(@Query() query: NewsQueryDto): Promise<NewsResponse> {
    return this.newsService.getArticles(query);
  }

  @Get('title/:title')
  @ApiOperation({ summary: 'Find articles by title' })
  @ApiResponse({
    status: 200,
    description: 'Returns articles matching the title',
  })
  @ApiQuery({
    name: 'max',
    required: false,
    type: Number,
    description: 'Maximum number of articles to return',
  })
  async findByTitle(
    @Param('title') title: string,
    @Query('max', new DefaultValuePipe(10), ParseIntPipe) max: number,
  ): Promise<Article[]> {
    return this.newsService.findByTitle(title, max);
  }

  @Get('search/:keywords')
  @ApiOperation({ summary: 'Search articles by keywords' })
  @ApiResponse({
    status: 200,
    description: 'Returns articles matching the keywords',
  })
  @ApiQuery({
    name: 'max',
    required: false,
    type: Number,
    description: 'Maximum number of articles to return',
  })
  async searchByKeywords(
    @Param('keywords') keywords: string,
    @Query('max', new DefaultValuePipe(10), ParseIntPipe) max: number,
  ): Promise<NewsResponse> {
    return this.newsService.searchByKeywords(keywords, max);
  }
}
