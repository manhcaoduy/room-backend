/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { User } from '../../../shared/user/v1/user';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'umaster.user.v1';

export interface GetOrCreateUserByEmailRequest {
  email: string;
  source?: string | undefined;
}

export interface GetOrCreateUserByEmailResponse {
  user?: User;
  isNewUser: boolean;
}

export const UMASTER_USER_V1_PACKAGE_NAME = 'umaster.user.v1';

export interface UserServiceClient {
  getOrCreateUserByEmail(
    request: GetOrCreateUserByEmailRequest,
    metadata?: Metadata,
  ): Observable<GetOrCreateUserByEmailResponse>;
}

export interface UserServiceController {
  getOrCreateUserByEmail(
    request: GetOrCreateUserByEmailRequest,
    metadata?: Metadata,
  ):
    | Promise<GetOrCreateUserByEmailResponse>
    | Observable<GetOrCreateUserByEmailResponse>
    | GetOrCreateUserByEmailResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getOrCreateUserByEmail'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
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
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
