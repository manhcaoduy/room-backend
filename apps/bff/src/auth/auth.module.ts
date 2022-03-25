import { Module } from '@nestjs/common';

import {
  UMasterGrpcService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

import { SharedModule } from '../shared/shared.modules';
import { AuthController } from './auth.controller';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [
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
