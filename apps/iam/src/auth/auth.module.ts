import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  UMasterGrpcService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';
import { RedisModule } from '@app/core/thirdparty/redis/redis.module';

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secretKey'),
      }),
      inject: [ConfigService],
    }),
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
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UMasterGrpcServiceUserService,
      useFactory: (client: GrpcClient) => {
        return client.getService<UserServiceClient>(
          UMasterGrpcServiceUserService,
        );
      },
      inject: [UMasterGrpcService],
    },
  ],
})
export class AuthModule {}
