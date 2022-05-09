import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import {
  UMasterGrpcService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

@Module({
  imports: [SharedModule],
  controllers: [ItemController],
  providers: [
    ItemService,
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
export class ItemModule {}
