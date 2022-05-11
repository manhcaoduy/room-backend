import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import {
  ChangeItemSaleRequest,
  ChangeItemSaleResponse,
  ChangeOwnerItemRequest,
  ChangeOwnerItemResponse,
  CheckOwnershipRequest,
  CheckOwnershipResponse,
  CreateItemRequest,
  CreateItemResponse,
  GetItemsByIdsRequest,
  GetItemsByIdsResponse,
  GetItemsByUserRequest,
  GetItemsByUserResponse,
  GetItemsByWalletRequest,
  GetItemsByWalletResponse,
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
    const { userId } = request;
    const items = await this.itemService.getMarketplace({ userId });
    return { items };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async checkOwnership(
    request: CheckOwnershipRequest,
  ): Promise<CheckOwnershipResponse> {
    const { userId, itemId } = request;
    const owned = await this.itemService.checkOwnership({ userId, itemId });
    return { owned };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async getItemsByWallet(
    request: GetItemsByWalletRequest,
  ): Promise<GetItemsByWalletResponse> {
    const { walletAddress } = request;
    const items = await this.itemService.getItemsByWallet({ walletAddress });
    return { items };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async changeItemSale(
    request: ChangeItemSaleRequest,
  ): Promise<ChangeItemSaleResponse> {
    const { itemId, isForSale, price, marketItemId } = request;
    const item = await this.itemService.changeItemSale({
      itemId,
      isForSale,
      price,
      marketItemId,
    });
    return { item };
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
    const { walletAddress, itemId, tokenId } = request;
    const item = await this.itemService.mintItem({
      walletAddress,
      itemId,
      tokenId,
    });
    return { item };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async changeOwnerItem(
    request: ChangeOwnerItemRequest,
  ): Promise<ChangeOwnerItemResponse> {
    const { walletAddress, itemId } = request;
    const item = await this.itemService.changeOwnerItem({
      walletAddress,
      itemId,
    });
    return { item };
  }
}
