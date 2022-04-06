import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DalModule } from '@app/core/dal/dal.module';

import { configModuleOptions } from './config/module-options';
import { UserRepository } from './repositories/user';
import { UserWalletRepository } from './repositories/user-wallet';

const repositories = [UserRepository, UserWalletRepository];

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    DalModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const options = configService.get('mongo');
        return {
          debug: options.debug,
          uri: options.uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...repositories],
  exports: [ConfigModule, ...repositories],
})
export class SharedModule {}
