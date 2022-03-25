import { DynamicModule, Global, Module } from '@nestjs/common';

import { DynamicModuleAsyncOptions } from '@app/core/framework/dynamic-module-option/dynamic-module-option';

import { REDIS_CONFIG } from './redis.constant';
import { RedisProvider } from './redis.provider';
import { RedisConfig } from './redis.type';

@Global()
@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {
  static forRootAsync(
    asyncOptions: DynamicModuleAsyncOptions<RedisConfig>,
  ): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CONFIG,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        RedisProvider,
      ],
      exports: [RedisProvider],
    };
  }
}
