import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { lastValueFrom } from 'rxjs';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { UMasterGrpcServiceUserService } from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { CurrentUser } from '@app/microservice/http/jwt-auth/jwt-auth.decorator';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import { JwtAccessTokenClaims } from '@app/microservice/http/jwt-auth/jwt-auth.interface';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

import {
  ConnectWalletAddressRequest,
  ConnectWalletAddressResponse,
} from './dtos/connect-wallet-address.dto';
import {
  DisconnectWalletAddressRequest,
  DisconnectWalletAddressResponse,
} from './dtos/disconnect-wallet-address.dto';
import {
  GenerateNonceMessageRequest,
  GenerateNonceMessageResponse,
} from './dtos/generate-nonce-message.dto';
import { GetUserWalletsResponse } from './dtos/get-user-wallets.dto';

@Controller('v1/user-wallet')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('User wallet')
@UseGuards(JwtAuthGuard)
export class UserWalletController {
  private logger: LoggerService;

  constructor(
    @Inject(UMasterGrpcServiceUserService)
    private readonly userService: UserServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(UserWalletController.name);
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: GetUserWalletsResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getUserWallets(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<GetUserWalletsResponse> {
    const { userWallets } = await lastValueFrom(
      this.userService.getWallets({
        userId: claims.userId,
      }),
    );
    return plainToClass(GetUserWalletsResponse, { userWallets });
  }

  @Post('/generate-nonce-message')
  @ApiResponse({
    status: 200,
    type: GenerateNonceMessageResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async generateNonceMessage(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: GenerateNonceMessageRequest,
  ): Promise<GenerateNonceMessageResponse> {
    const { walletAddress, network } = req;
    const { message } = await lastValueFrom(
      this.userService.generateNonceMessage({
        userId: claims.userId,
        walletAddress,
        network,
      }),
    );
    return plainToClass(GenerateNonceMessageResponse, { message });
  }

  @Post('/connect')
  @ApiResponse({
    status: 200,
    type: ConnectWalletAddressResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async connectWalletAddress(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: ConnectWalletAddressRequest,
  ): Promise<ConnectWalletAddressResponse> {
    const { walletAddress, network, signature } = req;
    const { userWallet } = await lastValueFrom(
      this.userService.connectWalletAddress({
        userId: claims.userId,
        walletAddress,
        network,
        signature,
      }),
    );
    return plainToClass(ConnectWalletAddressResponse, { userWallet });
  }

  @Post('/disconnect')
  @ApiResponse({
    status: 200,
    type: DisconnectWalletAddressResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async disconnectWalletAddress(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: DisconnectWalletAddressRequest,
  ): Promise<DisconnectWalletAddressResponse> {
    const { walletAddress, network } = req;
    const { wallet } = await lastValueFrom(
      this.userService.disconnectWalletAddress({
        userId: claims.userId,
        walletAddress,
        network,
      }),
    );
    return plainToClass(DisconnectWalletAddressResponse, { wallet });
  }
}
