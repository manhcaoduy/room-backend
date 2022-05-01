/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { ItemFavorite } from '../../../shared/item_favorite/v1/item_favorite';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'emaster.item_favorite.v1';

export interface GetItemFavoritesRequest {
  userId: string;
}

export interface GetItemFavoritesResponse {
  items: ItemFavorite[];
}

export interface CreateItemFavoriteRequest {
  itemId: string;
  userId: string;
}

export interface CreateItemFavoriteResponse {
  item?: ItemFavorite;
}

export interface RemoveItemFavoriteRequest {
  itemId: string;
  userId: string;
}

export interface RemoveItemFavoriteResponse {
  result: boolean;
}

export const EMASTER_ITEM_FAVORITE_V1_PACKAGE_NAME = 'emaster.item_favorite.v1';

export interface ItemFavoriteServiceClient {
  getItemFavorites(
    request: GetItemFavoritesRequest,
    metadata?: Metadata,
  ): Observable<GetItemFavoritesResponse>;

  createItemFavorite(
    request: CreateItemFavoriteRequest,
    metadata?: Metadata,
  ): Observable<CreateItemFavoriteResponse>;

  removeItemFavorite(
    request: RemoveItemFavoriteRequest,
    metadata?: Metadata,
  ): Observable<RemoveItemFavoriteResponse>;
}

export interface ItemFavoriteServiceController {
  getItemFavorites(
    request: GetItemFavoritesRequest,
    metadata?: Metadata,
  ):
    | Promise<GetItemFavoritesResponse>
    | Observable<GetItemFavoritesResponse>
    | GetItemFavoritesResponse;

  createItemFavorite(
    request: CreateItemFavoriteRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateItemFavoriteResponse>
    | Observable<CreateItemFavoriteResponse>
    | CreateItemFavoriteResponse;

  removeItemFavorite(
    request: RemoveItemFavoriteRequest,
    metadata?: Metadata,
  ):
    | Promise<RemoveItemFavoriteResponse>
    | Observable<RemoveItemFavoriteResponse>
    | RemoveItemFavoriteResponse;
}

export function ItemFavoriteServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getItemFavorites',
      'createItemFavorite',
      'removeItemFavorite',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ItemFavoriteService', method)(
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
      GrpcStreamMethod('ItemFavoriteService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const ITEM_FAVORITE_SERVICE_NAME = 'ItemFavoriteService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
