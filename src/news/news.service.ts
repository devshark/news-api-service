import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { NewsQueryDto } from './dto/news-query.dto';
import { NewsResponse, Article } from './interfaces/news.interface';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly apiUrl: string = 'https://gnews.io/api/v4'; // default. override in config
  private readonly apiKey: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiUrl = this.configService.get<string>('GNEWS_API_URL') || this.apiUrl;
    this.apiKey = this.configService.get<string>('GNEWS_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('GNEWS_API_KEY is not set. API calls will likely fail.');
    }
  }

  async getArticles(query: NewsQueryDto): Promise<NewsResponse> {
    const cacheKey = this.generateCacheKey('articles', query);
    const cachedData = await this.cacheManager.get<NewsResponse>(cacheKey);

    if (cachedData) {
      this.logger.log('Returning cached articles data');
      return cachedData;
    }

    try {
      const params = {
        apikey: this.apiKey,
        q: query.q,
        country: query.country,
        lang: query.lang,
        max: query.max || 10,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/search`, { params }),
      );

      const result = response.data;
      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch articles: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch news articles');
    }
  }

  async findByTitle(title: string, max: number = 10): Promise<Article[]> {
    const cacheKey = this.generateCacheKey('title', { title, max });
    const cachedData = await this.cacheManager.get<Article[]>(cacheKey);

    if (cachedData) {
      this.logger.log('Returning cached title search data');
      return cachedData;
    }

    try {
      const params = {
        apikey: this.apiKey,
        q: title,
        max,
        in: 'title',
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/search`, { params }),
      );

      const articles = response.data.articles;
      await this.cacheManager.set(cacheKey, articles);
      return articles;
    } catch (error) {
      this.logger.error(
        `Failed to find articles by title: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to find articles by title',
      );
    }
  }

  async searchByKeywords(
    keywords: string,
    max: number = 10,
  ): Promise<NewsResponse> {
    const cacheKey = this.generateCacheKey('keywords', { keywords, max });
    const cachedData = await this.cacheManager.get<NewsResponse>(cacheKey);

    if (cachedData) {
      this.logger.log('Returning cached keyword search data');
      return cachedData;
    }

    try {
      const params = {
        apikey: this.apiKey,
        q: keywords,
        max,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/search`, { params }),
      );

      const result = response.data;
      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to search articles by keywords: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to search articles by keywords',
      );
    }
  }

  private generateCacheKey(type: string, params: any): string {
    return `${type}:${JSON.stringify(params)}`;
  }
}
