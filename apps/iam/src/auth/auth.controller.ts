import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from '@app/microservice/proto/iam/auth/v1/auth';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME)
  async login(request: LoginRequest): Promise<LoginResponse> {
    const token = this.authService.login(request.email, request.password);
    return token;
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const token = this.authService.register(
      request.email,
      request.password,
      request.username,
    );
    return token;
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    await this.authService.invalidateToken(request.accessToken);
    return {
      result: true,
    };
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    const valid = await this.authService.validateToken(request.accessToken);
    if (!valid) {
      return null;
    }
    const claims = this.authService.decodeAccessToken(request.accessToken);
    return { ...claims };
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const refreshToken = request.refreshToken;
    const valid = await this.authService.validateToken(refreshToken);
    if (!valid) {
      return null;
    }
    const claims = this.authService.decodeRefreshToken(refreshToken);
    const token = await this.authService.createJwtAccessToken(claims.userId);
    return token;
  }
}
