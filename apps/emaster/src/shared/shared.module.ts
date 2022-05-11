import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DalModule } from '@app/core/dal/dal.module';

import { configModuleOptions } from './config/module-options';
import { ItemRepository } from './repositories/item';
import { ItemFavoriteRepository } from './repositories/item-favorite';
import { ClientGrpcModule } from '@app/microservice/grpc/grpc-client/client-grpc.module';
import { UMasterGrpcService } from '@app/microservice/constants/microservice';
import { UMasterGrpcOptions } from '@app/microservice/grpc/grpc-options/umaster.option';
import { ItemHistoryRepository } from './repositories/item-history';

const repositories = [
  ItemRepository,
  ItemFavoriteRepository,
  ItemHistoryRepository,
];

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
    ClientGrpcModule.forRootAsync(
      {
        microservice: UMasterGrpcService,
      },
      {
        useFactory: (configService: ConfigService) => {
          const grpcEndpoint = configService.get<string>(
            'umaster.grpcEndpoint',
          );
          const grpcOptions = Object.assign({}, UMasterGrpcOptions, {
            url: grpcEndpoint,
          });
          return { options: grpcOptions };
        },
        inject: [ConfigService],
      },
    ),
  ],
  providers: [...repositories],
  exports: [ConfigModule, ClientGrpcModule, ...repositories],
})
export class SharedModule {}
