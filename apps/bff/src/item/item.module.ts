import { SharedModule } from '../shared/shared.modules';
import { ItemController } from './item.controller';
import { Module } from '@nestjs/common';
import {
  EMasterGrpcService,
  EMasterGrpcServiceItemService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { ItemServiceClient } from '@app/microservice/proto/emaster/item/v1/item';

@Module({
  imports: [SharedModule],
  controllers: [ItemController],
  providers: [
    {
      provide: EMasterGrpcServiceItemService,
      useFactory: (client: GrpcClient) => {
        return client.getService<ItemServiceClient>(
          EMasterGrpcServiceItemService,
        );
      },
      inject: [EMasterGrpcService],
    },
  ],
})
export class ItemModule {}
