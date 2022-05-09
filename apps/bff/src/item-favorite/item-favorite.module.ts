import { SharedModule } from '../shared/shared.modules';
import { Module } from '@nestjs/common';
import {
  EMasterGrpcService,
  EmasterGrpcServiceItemFavoriteService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { ItemFavoriteServiceClient } from '@app/microservice/proto/emaster/item_favorite/v1/item_favorite';
import { ItemFavoriteController } from './item-favorite.controller';

@Module({
  imports: [SharedModule],
  controllers: [ItemFavoriteController],
  providers: [
    {
      provide: EmasterGrpcServiceItemFavoriteService,
      useFactory: (client: GrpcClient) => {
        return client.getService<ItemFavoriteServiceClient>(
          EmasterGrpcServiceItemFavoriteService,
        );
      },
      inject: [EMasterGrpcService],
    },
  ],
})
export class ItemFavoriteModule {}
