import { Provider } from '@nestjs/common';
import * as IORedis from 'ioredis';

import { REDIS_CONFIG } from './redis.constant';
import { RedisClient, RedisConfig } from './redis.type';

export const REDIS_CLIENT = Symbol('IORedis.Redis');

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (redisConfig: RedisConfig): RedisClient => {
    return new IORedis(redisConfig);
  },
  inject: [REDIS_CONFIG],
};
