import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

import { HttpInvalidInputException } from '@app/core/framework/exceptions/http-exception';
import { extractTokenFromAuthorization } from '@app/core/utils/jwt';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import {
  IamGrpcServiceAuthService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { CurrentUser } from '@app/microservice/http/jwt-auth/jwt-auth.decorator';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import { JwtAccessTokenClaims } from '@app/microservice/http/jwt-auth/jwt-auth.interface';
import { AuthServiceClient } from '@app/microservice/proto/iam/auth/v1/auth';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

import { EActivityType, TrackActivityService } from '../track-activity';
import { AuthResponse } from './dtos/auth.dto';
import {
  LoginRequest,
  LoginResponse,
} from './dtos/login-by-email.dto';
import { LogoutResponse } from './dtos/logout.dto';
import {
  CompleteVerifyEmailRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './dtos/verify-email.dto';

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
    private readonly trackActivityService: TrackActivityService,
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
    description: '{ status: 1: data: {as type below} }',
  })
  async login(@Body() req: LoginRequest): Promise<LoginResponse> {
    const { isNewUser } = await lastValueFrom(
      this.authService.loginByEmail(req),
    );

    return {
      result: true,
      isNewUser,
    };
  }

  @Post('anonymous-login')
  @ApiResponse({
    status: 200,
    type: AuthResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async anonymousLogin(): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await lastValueFrom(
      this.authService.anonymousLogin({}),
    );
    return { accessToken, refreshToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @ApiResponse({
    status: 200,
    type: VerifyOtpResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async verifyEmail(
    @Body() req: VerifyOtpRequest,
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<VerifyOtpResponse> {
    await lastValueFrom(
      this.authService.verifyEmail({
        email: req.email || claims.email,
        userId: claims.userId,
      }),
    );

    return {
      result: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-verify')
  @ApiResponse({
    status: 200,
    type: AuthResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async completeVerifyEmail(
    @Body() req: CompleteVerifyEmailRequest,
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<AuthResponse> {
    const { otp } = req;
    const email = req.email || claims.email;
    const { accessToken, refreshToken } = await lastValueFrom(
      this.authService.completeVerifyEmail({
        email,
        userId: claims.userId,
        otp,
      }),
    );
    return {
      accessToken,
      refreshToken,
    };
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
    const resp = await lastValueFrom(this.authService.refreshToken(req));

    return {
      accessToken: resp.accessToken,
      refreshToken: resp.refreshToken,
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
    // track activity with Kafka
    this.trackActivityService.track(EActivityType.Logout, claims.userId);

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
