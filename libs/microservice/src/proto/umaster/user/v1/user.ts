/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { User, UserProfile } from '../../../shared/user/v1/user';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'umaster.user.v1';

export interface GetOrCreateUserByEmailRequest {
  email: string;
}

export interface GetOrCreateUserByEmailResponse {
  user?: User;
  isNewUser: boolean;
}

export interface FindByIdRequest {
  userId: string;
}

export interface FindByIdResponse {
  user?: User;
}

export interface FindByIdsRequest {
  userIds: string[];
}

export interface FindByIdsResponse {
  users: User[];
}

export interface FindByEmailRequest {
  email: string;
}

export interface FindByEmailResponse {
  user?: User;
}

export interface FindByUsernameRequest {
  username: string;
}

export interface FindByUsernameResponse {
  user?: User;
}

export interface UpdateProfileRequest {
  userId: string;
  userProfile?: UserProfile;
}

export interface UpdateProfileResponse {
  user?: User;
}

export const UMASTER_USER_V1_PACKAGE_NAME = 'umaster.user.v1';

export interface UserServiceClient {
  getOrCreateUserByEmail(
    request: GetOrCreateUserByEmailRequest,
    metadata?: Metadata,
  ): Observable<GetOrCreateUserByEmailResponse>;

  findById(
    request: FindByIdRequest,
    metadata?: Metadata,
  ): Observable<FindByIdResponse>;

  findByIds(
    request: FindByIdsRequest,
    metadata?: Metadata,
  ): Observable<FindByIdsResponse>;

  findByEmail(
    request: FindByEmailRequest,
    metadata?: Metadata,
  ): Observable<FindByEmailResponse>;

  findByUsername(
    request: FindByUsernameRequest,
    metadata?: Metadata,
  ): Observable<FindByUsernameResponse>;

  updateProfile(
    request: UpdateProfileRequest,
    metadata?: Metadata,
  ): Observable<UpdateProfileResponse>;
}

export interface UserServiceController {
  getOrCreateUserByEmail(
    request: GetOrCreateUserByEmailRequest,
    metadata?: Metadata,
  ):
    | Promise<GetOrCreateUserByEmailResponse>
    | Observable<GetOrCreateUserByEmailResponse>
    | GetOrCreateUserByEmailResponse;

  findById(
    request: FindByIdRequest,
    metadata?: Metadata,
  ):
    | Promise<FindByIdResponse>
    | Observable<FindByIdResponse>
    | FindByIdResponse;

  findByIds(
    request: FindByIdsRequest,
    metadata?: Metadata,
  ):
    | Promise<FindByIdsResponse>
    | Observable<FindByIdsResponse>
    | FindByIdsResponse;

  findByEmail(
    request: FindByEmailRequest,
    metadata?: Metadata,
  ):
    | Promise<FindByEmailResponse>
    | Observable<FindByEmailResponse>
    | FindByEmailResponse;

  findByUsername(
    request: FindByUsernameRequest,
    metadata?: Metadata,
  ):
    | Promise<FindByUsernameResponse>
    | Observable<FindByUsernameResponse>
    | FindByUsernameResponse;

  updateProfile(
    request: UpdateProfileRequest,
    metadata?: Metadata,
  ):
    | Promise<UpdateProfileResponse>
    | Observable<UpdateProfileResponse>
    | UpdateProfileResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getOrCreateUserByEmail',
      'findById',
      'findByIds',
      'findByEmail',
      'findByUsername',
      'updateProfile',
    ];
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
