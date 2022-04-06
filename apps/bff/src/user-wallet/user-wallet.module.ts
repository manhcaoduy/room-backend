import { Module } from '@nestjs/common';

import {
  UMasterGrpcService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/microservice/proto/umaster/user/v1/user';

import { SharedModule } from '../shared/shared.modules';
import { UserWalletController } from './user-wallet.controller';

@Module({
  imports: [SharedModule],
  controllers: [UserWalletController],
  providers: [
    {
      provide: UMasterGrpcServiceUserService,
      useFactory: (client: GrpcClient) => {
        return client.getService<UserServiceClient>(USER_SERVICE_NAME);
      },
      inject: [UMasterGrpcService],
    },
  ],
})
export class UserWalletModule {}
