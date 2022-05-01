import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import {
  ChangeOwnerItemRequest,
  ChangeOwnerItemResponse,
  CreateItemRequest,
  CreateItemResponse,
  GetItemsByIdsRequest,
  GetItemsByIdsResponse,
  GetItemsByUserRequest,
  GetItemsByUserResponse,
  GetMarketplaceRequest,
  GetMarketplaceResponse,
  ITEM_SERVICE_NAME,
  MintItemRequest,
  MintItemResponse,
} from '@app/microservice/proto/emaster/item/v1/item';

import { ItemService } from './item.service';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @GrpcMethod(ITEM_SERVICE_NAME)
  async getItemsByIds(
    request: GetItemsByIdsRequest,
  ): Promise<GetItemsByIdsResponse> {
    const { itemIds } = request;
    const items = await this.itemService.getItemsByIds({ itemIds });
    return { items };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async getItemsByUser(
    request: GetItemsByUserRequest,
  ): Promise<GetItemsByUserResponse> {
    const { userId } = request;
    const items = await this.itemService.getItemsByUser({ userId });
    return { items };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async getMarketplace(
    request: GetMarketplaceRequest,
  ): Promise<GetMarketplaceResponse> {
    const { walletAddresses } = request;
    const items = await this.itemService.getMarketplace({ walletAddresses });
    return { items };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async createItem(request: CreateItemRequest): Promise<CreateItemResponse> {
    const { userId, type, metadataIpfs } = request;
    const item = await this.itemService.createItem({
      userId,
      type,
      metadataIpfs,
    });
    return { item };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async mintItem(request: MintItemRequest): Promise<MintItemResponse> {
    const { walletId, itemId } = request;
    const item = await this.itemService.mintItem({ walletId, itemId });
    return { item };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async changeOwnerItem(
    request: ChangeOwnerItemRequest,
  ): Promise<ChangeOwnerItemResponse> {
    const { walletId, itemId } = request;
    const item = await this.itemService.changeOwnerItem({ walletId, itemId });
    return { item };
  }
}
