import IORedis from 'ioredis';

export type RedisClient = IORedis.Redis;

export interface RedisConfig {
  port: number;
  host: string;
  db: number;
  password: string;
  connectTimeout: number;
  enableReadyCheck: boolean;
  showFriendlyErrorStack: boolean;
  lazyConnect?: boolean;
}
