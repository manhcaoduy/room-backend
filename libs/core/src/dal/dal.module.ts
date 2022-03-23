import { DynamicModule, Module } from '@nestjs/common';

import { DalService } from '.';
import { DynamicModuleAsyncOptions } from '../framework/dynamic-module-option/dynamic-module-option';
import { DAL_SERVICE_OPTIONS } from './dal.constant';
import { DalServiceOptions } from './dal.options';

@Module({})
export class DalModule {
  static forRootAsync(
    asyncOptions: DynamicModuleAsyncOptions<DalServiceOptions>,
  ): DynamicModule {
    return {
      module: DalModule,
      providers: [
        {
          provide: DAL_SERVICE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        DalService,
      ],
    };
  }
}
