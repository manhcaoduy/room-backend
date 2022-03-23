import { DynamicModule, Module } from '@nestjs/common';

import { DynamicModuleAsyncOptions } from '@app/core/framework/dynamic-module-option/dynamic-module-option';

import { GrpcClient } from '.';
import {
  CLIENT_ASYNC_OPTIONS,
  CLIENT_STATIC_OPTIONS,
} from './client-grpc.constant';
import {
  ClientGrpcAsyncOptions,
  ClientGrpcStaticOptions,
} from './client-grpc.type';

@Module({})
export class ClientGrpcModule {
  static forRootAsync(
    staticOptions: ClientGrpcStaticOptions,
    asyncOptions: DynamicModuleAsyncOptions<ClientGrpcAsyncOptions>,
  ): DynamicModule {
    return {
      module: ClientGrpcModule,
      providers: [
        {
          provide: CLIENT_STATIC_OPTIONS,
          useValue: staticOptions,
        },
        {
          provide: CLIENT_ASYNC_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        {
          provide: staticOptions.microservice,
          useClass: GrpcClient,
        },
      ],
      exports: [staticOptions.microservice],
    };
  }
}
