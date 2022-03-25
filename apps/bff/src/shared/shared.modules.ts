import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';
import { RedisModule } from '@app/core/thirdparty/redis/redis.module';
import { GrpcClientProviderModule } from './grpc-client-provider/grpc-client-provider.module';
import {
  IamGrpcService,
  IamGrpcServiceAuthService,
} from '@app/microservice/constants/microservice';
import { AuthServiceClient } from '@app/microservice/proto/iam/auth/v1/auth';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    GrpcClientProviderModule,
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const redisConfig = config.get('redis');
        return {
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.pwd,
          db: redisConfig.db,
          connectTimeout: 5000,
          enableReadyCheck: true,
          showFriendlyErrorStack: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IamGrpcServiceAuthService,
      useFactory: (client: GrpcClient) => {
        return client.getService<AuthServiceClient>(IamGrpcServiceAuthService);
      },
      inject: [IamGrpcService],
    },
  ],
  exports: [GrpcClientProviderModule, IamGrpcServiceAuthService],
})
export class SharedModule {}
