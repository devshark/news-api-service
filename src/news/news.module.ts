import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 60 * 5, // cache for 5 minutes
      max: 100, // maximum number of items in cache
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
