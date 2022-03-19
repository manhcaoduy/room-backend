/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Item, ItemType } from '../../../shared/item/v1/item';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'emaster.item.v1';

export interface GetUserItemRequest {
  userId: string;
}

export interface GetUserItemResponse {
  items: Item[];
}

export interface AddUserItemRequest {
  userId: string;
  item?: Item;
}

export interface AddUserItemResponse {
  item?: Item;
}

export interface RemoveUserItemRequest {
  item?: Item;
}

export interface RemoveUserItemResponse {
  item?: Item;
}

export interface CreateUserItemRequest {
  type: ItemType;
  link: string;
}

export interface CreateUserItemResponse {
  item?: Item;
}

export const EMASTER_ITEM_V1_PACKAGE_NAME = 'emaster.item.v1';

export interface ItemServiceClient {
  getUserItem(
    request: GetUserItemRequest,
    metadata?: Metadata,
  ): Observable<GetUserItemResponse>;

  addUserItem(
    request: AddUserItemRequest,
    metadata?: Metadata,
  ): Observable<AddUserItemResponse>;

  removeUserItem(
    request: RemoveUserItemRequest,
    metadata?: Metadata,
  ): Observable<RemoveUserItemResponse>;

  createUserItem(
    request: CreateUserItemRequest,
    metadata?: Metadata,
  ): Observable<CreateUserItemResponse>;
}

export interface ItemServiceController {
  getUserItem(
    request: GetUserItemRequest,
    metadata?: Metadata,
  ):
    | Promise<GetUserItemResponse>
    | Observable<GetUserItemResponse>
    | GetUserItemResponse;

  addUserItem(
    request: AddUserItemRequest,
    metadata?: Metadata,
  ):
    | Promise<AddUserItemResponse>
    | Observable<AddUserItemResponse>
    | AddUserItemResponse;

  removeUserItem(
    request: RemoveUserItemRequest,
    metadata?: Metadata,
  ):
    | Promise<RemoveUserItemResponse>
    | Observable<RemoveUserItemResponse>
    | RemoveUserItemResponse;

  createUserItem(
    request: CreateUserItemRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateUserItemResponse>
    | Observable<CreateUserItemResponse>
    | CreateUserItemResponse;
}

export function ItemServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getUserItem',
      'addUserItem',
      'removeUserItem',
      'createUserItem',
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
