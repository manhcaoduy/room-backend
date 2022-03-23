import { DynamicModule, Global, Module } from '@nestjs/common';

import { DynamicModuleAsyncOptions } from '@app/core/framework/dynamic-module-option/dynamic-module-option';

import { HttpLoggingInterceptor } from './http-logging-interceptor.service';
import {
  HTTP_LOGGING_ASYNC_OPTIONS,
  HTTP_LOGGING_STATIC_OPTIONS,
} from './http-logging.constant';
import {
  HttpLoggingAsyncOptions,
  HttpLoggingStaticOptions,
} from './http-logging.type';

@Global()
@Module({})
export class HttpLoggingModule {
  static forRootAsync(
    staticOptions: HttpLoggingStaticOptions,
    asyncOptions: DynamicModuleAsyncOptions<HttpLoggingAsyncOptions>,
  ): DynamicModule {
    return {
      module: HttpLoggingModule,
      providers: [
        {
          provide: HTTP_LOGGING_STATIC_OPTIONS,
          useValue: staticOptions,
        },
        {
          provide: HTTP_LOGGING_ASYNC_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        HttpLoggingInterceptor,
      ],
      exports: [
        HttpLoggingInterceptor,
        HTTP_LOGGING_ASYNC_OPTIONS,
        HTTP_LOGGING_STATIC_OPTIONS,
      ],
    };
  }
}
