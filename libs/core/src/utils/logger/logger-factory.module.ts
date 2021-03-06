import { DynamicModule, Global, Module } from '@nestjs/common';

import { DynamicModuleAsyncOptions } from '@app/core/framework/dynamic-module-option/dynamic-module-option';

import { LoggerFactoryService } from './logger-factory.service';
import { LOGGER_FACTORY_OPTION as LOGGER_FACTORY_OPTIONS } from './logger.constant';
import { LoggerServiceOption } from './logger.type';

@Global()
@Module({})
export class LoggerFactoryModule {
  static forRootAsync(
    asyncOptions: DynamicModuleAsyncOptions<LoggerServiceOption>,
  ): DynamicModule {
    return {
      module: LoggerFactoryModule,
      providers: [
        {
          provide: LOGGER_FACTORY_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        LoggerFactoryService,
      ],
      exports: [LoggerFactoryService],
    };
  }
}
