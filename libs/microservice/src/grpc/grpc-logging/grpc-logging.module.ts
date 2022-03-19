import { DynamicModule, Global, Module } from '@nestjs/common';

import { DynamicModuleAsyncOptions } from '@app/core/framework/dynamic-module-option/dynamic-module-option';

import { GRPC_LOGGING_OPTIONS } from './grpc-logging.constant';
import { GrpcLoggingOptions } from './grpc-logging.type';

@Global()
@Module({})
export class GrpcLoggingModule {
  static forRootAsync(
    asyncOptions: DynamicModuleAsyncOptions<GrpcLoggingOptions>,
  ): DynamicModule {
    return {
      module: GrpcLoggingModule,
      providers: [
        {
          provide: GRPC_LOGGING_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
      ],
      exports: [GRPC_LOGGING_OPTIONS],
    };
  }
}
