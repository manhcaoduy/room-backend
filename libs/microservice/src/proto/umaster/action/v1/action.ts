/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { ActionType, Action } from '../../../shared/action/v1/action';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'umaster.action.v1';

export interface CreateActionRequest {
  userId: string;
  itemId: string;
  itemName: string;
  type: ActionType;
  txHash: string;
}

export interface CreateActionResponse {
  action?: Action;
}

export interface GetActionsRequest {
  userId: string;
}

export interface GetActionsResponse {
  actions: Action[];
}

export const UMASTER_ACTION_V1_PACKAGE_NAME = 'umaster.action.v1';

export interface ActionServiceClient {
  createAction(
    request: CreateActionRequest,
    metadata?: Metadata,
  ): Observable<CreateActionResponse>;

  getActions(
    request: GetActionsRequest,
    metadata?: Metadata,
  ): Observable<GetActionsResponse>;
}

export interface ActionServiceController {
  createAction(
    request: CreateActionRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateActionResponse>
    | Observable<CreateActionResponse>
    | CreateActionResponse;

  getActions(
    request: GetActionsRequest,
    metadata?: Metadata,
  ):
    | Promise<GetActionsResponse>
    | Observable<GetActionsResponse>
    | GetActionsResponse;
}

export function ActionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createAction', 'getActions'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ActionService', method)(
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
      GrpcStreamMethod('ActionService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const ACTION_SERVICE_NAME = 'ActionService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
