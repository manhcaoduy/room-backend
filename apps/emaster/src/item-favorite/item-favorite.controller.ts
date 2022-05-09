import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import { ItemFavoriteService } from './item-favorite.service';
import {
  CheckFavoriteRequest,
  CheckFavoriteResponse,
  CreateItemFavoriteRequest,
  CreateItemFavoriteResponse,
  GetItemFavoritesRequest,
  GetItemFavoritesResponse,
  ITEM_FAVORITE_SERVICE_NAME,
  RemoveItemFavoriteRequest,
  RemoveItemFavoriteResponse,
} from '@app/microservice/proto/emaster/item_favorite/v1/item_favorite';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class ItemFavoriteController {
  constructor(private readonly itemFavoriteService: ItemFavoriteService) {}

  @GrpcMethod(ITEM_FAVORITE_SERVICE_NAME)
  async checkFavorite(
    request: CheckFavoriteRequest,
  ): Promise<CheckFavoriteResponse> {
    const { userId, itemId } = request;
    const isFavorite = await this.itemFavoriteService.checkFavorite({
      userId,
      itemId,
    });
    return { isFavorite };
  }

  @GrpcMethod(ITEM_FAVORITE_SERVICE_NAME)
  async getItemFavorites(
    request: GetItemFavoritesRequest,
  ): Promise<GetItemFavoritesResponse> {
    const { userId } = request;
    const items = await this.itemFavoriteService.getItemFavorites({ userId });
    return { items };
  }

  @GrpcMethod(ITEM_FAVORITE_SERVICE_NAME)
  async createItemFavorite(
    request: CreateItemFavoriteRequest,
  ): Promise<CreateItemFavoriteResponse> {
    const { itemId, userId } = request;
    const item = await this.itemFavoriteService.createItemFavorite({
      itemId,
      userId,
    });
    return { item };
  }

  @GrpcMethod(ITEM_FAVORITE_SERVICE_NAME)
  async removeItemFavorite(
    request: RemoveItemFavoriteRequest,
  ): Promise<RemoveItemFavoriteResponse> {
    const { itemId, userId } = request;
    const result = await this.itemFavoriteService.removeItemFavorite({
      itemId,
      userId,
    });
    return { result };
  }
}
