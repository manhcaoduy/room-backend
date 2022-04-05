import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';
import { Request } from 'express';

import {
  IamGrpcServiceAuthService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';
import { lastValueFrom } from 'rxjs';
import { LoginRequest, LoginResponse } from './dtos/login.dto';
import { RegisterRequest, RegisterResponse } from './dtos/register.dto';
import { AuthResponse } from './dtos/auth.dto';
import { extractTokenFromAuthorization } from '@app/core/utils/jwt';
import { HttpInvalidInputException } from '@app/core/framework/exceptions/http-exception';
import { AuthServiceClient } from '@app/microservice/proto/iam/auth/v1/auth';
import { VerifyTokenResponse } from './dtos/verify.dto';
import {
  CurrentUser,
  JwtAccessTokenClaims,
  JwtAuthGuard,
} from '@app/microservice/http/jwt-auth';
import { LogoutResponse } from './dtos/logout.dto';

@Controller('v1/auth')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Auth')
export class AuthController {
  private logger: LoggerService;

  constructor(
    @Inject(IamGrpcServiceAuthService)
    private readonly authService: AuthServiceClient,
    @Inject(UMasterGrpcServiceUserService)
    private readonly userService: UserServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(
      `Gateway${AuthController.name}`,
    );
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: LoginResponse,
    description: '{ data: {as type below} }',
  })
  async login(@Body() req: LoginRequest): Promise<LoginResponse> {
    const token = await lastValueFrom(this.authService.login(req));
    return token;
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    type: RegisterResponse,
    description: '{ data: {as type below} }',
  })
  async register(@Body() req: RegisterRequest): Promise<RegisterResponse> {
    const token = await lastValueFrom(this.authService.register(req));
    return token;
  }

  @Post('/refresh-token')
  @ApiResponse({
    status: 200,
    type: AuthResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async refreshToken(@Req() request: Request): Promise<AuthResponse> {
    const { authorization } = request.headers;
    const refreshToken = extractTokenFromAuthorization(authorization);
    if (!refreshToken) {
      throw new HttpInvalidInputException('refresh token is invalid');
    }
    const req = { refreshToken };
    const token = await lastValueFrom(this.authService.refreshToken(req));
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/me')
  @ApiResponse({
    status: 200,
    type: VerifyTokenResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async verifyToken(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<VerifyTokenResponse> {
    return {
      email: claims.email,
      username: claims.username,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiResponse({
    status: 200,
    type: LogoutResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async logout(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Req() request: Request,
  ): Promise<LogoutResponse> {
    const { authorization } = request.headers;
    const accessToken = extractTokenFromAuthorization(authorization);
    if (!accessToken) {
      throw new HttpInvalidInputException('access token is invalid');
    }
    const req = { accessToken };
    const resp = await lastValueFrom(this.authService.logout(req));

    return {
      result: resp.result,
    };
  }
}
