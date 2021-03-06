/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Item, ItemType } from '../../../shared/item/v1/item';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'emaster.item.v1';

export interface GetItemsByIdsRequest {
  itemIds: string[];
}

export interface GetItemsByIdsResponse {
  items: Item[];
}

export interface GetItemsByUserRequest {
  userId: string;
}

export interface GetItemsByUserResponse {
  items: Item[];
}

export interface GetMarketplaceRequest {
  userId: string;
}

export interface GetMarketplaceResponse {
  items: Item[];
}

export interface CheckOwnershipRequest {
  userId: string;
  itemId: string;
}

export interface CheckOwnershipResponse {
  owned: boolean;
}

export interface ChangeItemSaleRequest {
  itemId: string;
  isForSale: boolean;
  price: number;
  marketItemId?: number | undefined;
}

export interface ChangeItemSaleResponse {
  item?: Item;
}

export interface GetItemsByWalletRequest {
  walletAddress: string;
}

export interface GetItemsByWalletResponse {
  items: Item[];
}

export interface CreateItemRequest {
  userId: string;
  type: ItemType;
  metadataIpfs: string;
}

export interface CreateItemResponse {
  item?: Item;
}

export interface MintItemRequest {
  walletAddress: string;
  itemId: string;
  tokenId: number;
}

export interface MintItemResponse {
  item?: Item;
}

export interface ChangeOwnerItemRequest {
  walletAddress: string;
  itemId: string;
}

export interface ChangeOwnerItemResponse {
  item?: Item;
}

export const EMASTER_ITEM_V1_PACKAGE_NAME = 'emaster.item.v1';

export interface ItemServiceClient {
  getItemsByIds(
    request: GetItemsByIdsRequest,
    metadata?: Metadata,
  ): Observable<GetItemsByIdsResponse>;

  getItemsByUser(
    request: GetItemsByUserRequest,
    metadata?: Metadata,
  ): Observable<GetItemsByUserResponse>;

  getItemsByWallet(
    request: GetItemsByWalletRequest,
    metadata?: Metadata,
  ): Observable<GetItemsByWalletResponse>;

  getMarketplace(
    request: GetMarketplaceRequest,
    metadata?: Metadata,
  ): Observable<GetMarketplaceResponse>;

  checkOwnership(
    request: CheckOwnershipRequest,
    metadata?: Metadata,
  ): Observable<CheckOwnershipResponse>;

  changeItemSale(
    request: ChangeItemSaleRequest,
    metadata?: Metadata,
  ): Observable<ChangeItemSaleResponse>;

  createItem(
    request: CreateItemRequest,
    metadata?: Metadata,
  ): Observable<CreateItemResponse>;

  mintItem(
    request: MintItemRequest,
    metadata?: Metadata,
  ): Observable<MintItemResponse>;

  changeOwnerItem(
    request: ChangeOwnerItemRequest,
    metadata?: Metadata,
  ): Observable<ChangeOwnerItemResponse>;
}

export interface ItemServiceController {
  getItemsByIds(
    request: GetItemsByIdsRequest,
    metadata?: Metadata,
  ):
    | Promise<GetItemsByIdsResponse>
    | Observable<GetItemsByIdsResponse>
    | GetItemsByIdsResponse;

  getItemsByUser(
    request: GetItemsByUserRequest,
    metadata?: Metadata,
  ):
    | Promise<GetItemsByUserResponse>
    | Observable<GetItemsByUserResponse>
    | GetItemsByUserResponse;

  getItemsByWallet(
    request: GetItemsByWalletRequest,
    metadata?: Metadata,
  ):
    | Promise<GetItemsByWalletResponse>
    | Observable<GetItemsByWalletResponse>
    | GetItemsByWalletResponse;

  getMarketplace(
    request: GetMarketplaceRequest,
    metadata?: Metadata,
  ):
    | Promise<GetMarketplaceResponse>
    | Observable<GetMarketplaceResponse>
    | GetMarketplaceResponse;

  checkOwnership(
    request: CheckOwnershipRequest,
    metadata?: Metadata,
  ):
    | Promise<CheckOwnershipResponse>
    | Observable<CheckOwnershipResponse>
    | CheckOwnershipResponse;

  changeItemSale(
    request: ChangeItemSaleRequest,
    metadata?: Metadata,
  ):
    | Promise<ChangeItemSaleResponse>
    | Observable<ChangeItemSaleResponse>
    | ChangeItemSaleResponse;

  createItem(
    request: CreateItemRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateItemResponse>
    | Observable<CreateItemResponse>
    | CreateItemResponse;

  mintItem(
    request: MintItemRequest,
    metadata?: Metadata,
  ):
    | Promise<MintItemResponse>
    | Observable<MintItemResponse>
    | MintItemResponse;

  changeOwnerItem(
    request: ChangeOwnerItemRequest,
    metadata?: Metadata,
  ):
    | Promise<ChangeOwnerItemResponse>
    | Observable<ChangeOwnerItemResponse>
    | ChangeOwnerItemResponse;
}

export function ItemServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getItemsByIds',
      'getItemsByUser',
      'getItemsByWallet',
      'getMarketplace',
      'checkOwnership',
      'changeItemSale',
      'createItem',
      'mintItem',
      'changeOwnerItem',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ItemService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('ItemService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const ITEM_SERVICE_NAME = 'ItemService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
