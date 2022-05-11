/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import {
  HistoryType,
  ItemHistory,
} from '../../../shared/item_history/v1/item_history';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'emaster.item_history.v1';

export interface CreateItemHistoryRequest {
  itemId: string;
  actor: string;
  type: HistoryType;
}

export interface CreateItemHistoryResponse {
  itemHistory?: ItemHistory;
}

export interface GetItemHistoryRequest {
  itemId: string;
}

export interface GetItemHistoryResponse {
  itemHistories: ItemHistory[];
}

export const EMASTER_ITEM_HISTORY_V1_PACKAGE_NAME = 'emaster.item_history.v1';

export interface ItemHistoryServiceClient {
  createItemHistory(
    request: CreateItemHistoryRequest,
    metadata?: Metadata,
  ): Observable<CreateItemHistoryResponse>;

  getItemHistory(
    request: GetItemHistoryRequest,
    metadata?: Metadata,
  ): Observable<GetItemHistoryResponse>;
}

export interface ItemHistoryServiceController {
  createItemHistory(
    request: CreateItemHistoryRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateItemHistoryResponse>
    | Observable<CreateItemHistoryResponse>
    | CreateItemHistoryResponse;

  getItemHistory(
    request: GetItemHistoryRequest,
    metadata?: Metadata,
  ):
    | Promise<GetItemHistoryResponse>
    | Observable<GetItemHistoryResponse>
    | GetItemHistoryResponse;
}

export function ItemHistoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createItemHistory', 'getItemHistory'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ItemHistoryService', method)(
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
      GrpcStreamMethod('ItemHistoryService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const ITEM_HISTORY_SERVICE_NAME = 'ItemHistoryService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
