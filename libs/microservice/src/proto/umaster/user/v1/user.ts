/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import {
  User,
  UserProfile,
  WalletNetwork,
  Wallet,
} from '../../../shared/user/v1/user';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'umaster.user.v1';

export interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
}

export interface CreateUserResponse {
  user?: User;
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

export interface FindByWalletAddressRequest {
  walletAddress: string;
}

export interface FindByWalletAddressResponse {
  user?: User;
}

export interface GenerateNonceMessageRequest {
  userId: string;
  walletAddress: string;
  network: WalletNetwork;
}

export interface GenerateNonceMessageResponse {
  message: string;
}

export interface ConnectWalletAddressRequest {
  userId: string;
  walletAddress: string;
  network: WalletNetwork;
  signature: string;
}

export interface ConnectWalletAddressResponse {
  userWallet?: Wallet;
}

export interface DisconnectWalletAddressRequest {
  userId: string;
  walletAddress: string;
  network: WalletNetwork;
}

export interface DisconnectWalletAddressResponse {
  wallet?: Wallet;
}

export interface GetWalletsRequest {
  userId: string;
}

export interface GetWalletsResponse {
  userWallets: Wallet[];
}

export const UMASTER_USER_V1_PACKAGE_NAME = 'umaster.user.v1';

export interface UserServiceClient {
  createUser(
    request: CreateUserRequest,
    metadata?: Metadata,
  ): Observable<CreateUserResponse>;

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

  findByWalletAddress(
    request: FindByWalletAddressRequest,
    metadata?: Metadata,
  ): Observable<FindByWalletAddressResponse>;

  generateNonceMessage(
    request: GenerateNonceMessageRequest,
    metadata?: Metadata,
  ): Observable<GenerateNonceMessageResponse>;

  connectWalletAddress(
    request: ConnectWalletAddressRequest,
    metadata?: Metadata,
  ): Observable<ConnectWalletAddressResponse>;

  getWallets(
    request: GetWalletsRequest,
    metadata?: Metadata,
  ): Observable<GetWalletsResponse>;

  disconnectWalletAddress(
    request: DisconnectWalletAddressRequest,
    metadata?: Metadata,
  ): Observable<DisconnectWalletAddressResponse>;

  updateProfile(
    request: UpdateProfileRequest,
    metadata?: Metadata,
  ): Observable<UpdateProfileResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;

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

  findByWalletAddress(
    request: FindByWalletAddressRequest,
    metadata?: Metadata,
  ):
    | Promise<FindByWalletAddressResponse>
    | Observable<FindByWalletAddressResponse>
    | FindByWalletAddressResponse;

  generateNonceMessage(
    request: GenerateNonceMessageRequest,
    metadata?: Metadata,
  ):
    | Promise<GenerateNonceMessageResponse>
    | Observable<GenerateNonceMessageResponse>
    | GenerateNonceMessageResponse;

  connectWalletAddress(
    request: ConnectWalletAddressRequest,
    metadata?: Metadata,
  ):
    | Promise<ConnectWalletAddressResponse>
    | Observable<ConnectWalletAddressResponse>
    | ConnectWalletAddressResponse;

  getWallets(
    request: GetWalletsRequest,
    metadata?: Metadata,
  ):
    | Promise<GetWalletsResponse>
    | Observable<GetWalletsResponse>
    | GetWalletsResponse;

  disconnectWalletAddress(
    request: DisconnectWalletAddressRequest,
    metadata?: Metadata,
  ):
    | Promise<DisconnectWalletAddressResponse>
    | Observable<DisconnectWalletAddressResponse>
    | DisconnectWalletAddressResponse;

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
      'createUser',
      'findById',
      'findByIds',
      'findByEmail',
      'findByUsername',
      'findByWalletAddress',
      'generateNonceMessage',
      'connectWalletAddress',
      'getWallets',
      'disconnectWalletAddress',
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
