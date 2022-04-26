/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'iam.auth.v1';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  accessToken: string;
}

export interface LogoutResponse {
  result: boolean;
}

export interface VerifyTokenRequest {
  accessToken: string;
}

export interface VerifyTokenResponse {
  userId: string;
  username: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const IAM_AUTH_V1_PACKAGE_NAME = 'iam.auth.v1';

export interface AuthServiceClient {
  login(request: LoginRequest, metadata?: Metadata): Observable<LoginResponse>;

  register(
    request: RegisterRequest,
    metadata?: Metadata,
  ): Observable<RegisterResponse>;

  logout(
    request: LogoutRequest,
    metadata?: Metadata,
  ): Observable<LogoutResponse>;

  verifyToken(
    request: VerifyTokenRequest,
    metadata?: Metadata,
  ): Observable<VerifyTokenResponse>;

  refreshToken(
    request: RefreshTokenRequest,
    metadata?: Metadata,
  ): Observable<RefreshTokenResponse>;
}

export interface AuthServiceController {
  login(
    request: LoginRequest,
    metadata?: Metadata,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  register(
    request: RegisterRequest,
    metadata?: Metadata,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse;

  logout(
    request: LogoutRequest,
    metadata?: Metadata,
  ): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;

  verifyToken(
    request: VerifyTokenRequest,
    metadata?: Metadata,
  ):
    | Promise<VerifyTokenResponse>
    | Observable<VerifyTokenResponse>
    | VerifyTokenResponse;

  refreshToken(
    request: RefreshTokenRequest,
    metadata?: Metadata,
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'login',
      'register',
      'logout',
      'verifyToken',
      'refreshToken',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AuthService', method)(
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
      GrpcStreamMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
