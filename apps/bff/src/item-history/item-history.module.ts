import { SharedModule } from '../shared/shared.modules';
import { Module } from '@nestjs/common';
import {
  EMasterGrpcService,
  EmasterGrpcServiceItemHistoryService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { ItemHistoryServiceClient } from '@app/microservice/proto/emaster/item_history/v1/item_history';
import { ItemHistoryController } from './item-history.controller';

@Module({
  imports: [SharedModule],
  controllers: [ItemHistoryController],
  providers: [
    {
      provide: EmasterGrpcServiceItemHistoryService,
      useFactory: (client: GrpcClient) => {
        return client.getService<ItemHistoryServiceClient>(
          EmasterGrpcServiceItemHistoryService,
        );
      },
      inject: [EMasterGrpcService],
    },
  ],
})
export class ItemHistoryModule {}
