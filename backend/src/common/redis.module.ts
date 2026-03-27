import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './services/redis.service';
import { redisConfig } from '../config/redis.config';

@Global()
@Module({
  imports: [CacheModule.register(redisConfig)],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
