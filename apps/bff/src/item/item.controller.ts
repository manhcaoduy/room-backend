import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import {
  EMasterGrpcServiceItemService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import { CreateItemRequest, CreateItemResponse } from './dtos/create-item.dto';
import { CurrentUser } from '@app/microservice/http/jwt-auth/jwt-auth.decorator';
import { JwtAccessTokenClaims } from '@app/microservice/http/jwt-auth';
import { lastValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { MintItemRequest, MintItemResponse } from './dtos/mint-item.dto';
import {
  ChangeOwnerItemRequest,
  ChangeOwnerItemResponse,
} from './dtos/change-owner-item.dto';
import { GetItemsByUserIdDtoResponse } from './dtos/get-items-by-user-id.dto';
import {
  GetItemsByIdsQuery,
  GetItemsByIdsResponse,
} from './dtos/get-items-by-ids.dto';
import { ItemServiceClient } from '@app/microservice/proto/emaster/item/v1/item';
import { GetMarketplaceResponse } from './dtos/get-marketplace.dto';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

@Controller('v1/items')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  private logger: LoggerService;

  constructor(
    @Inject(UMasterGrpcServiceUserService)
    private readonly userService: UserServiceClient,
    @Inject(EMasterGrpcServiceItemService)
    private readonly itemService: ItemServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(ItemController.name);
  }

  @Get('/ids')
  @ApiResponse({
    status: 200,
    type: GetItemsByIdsResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getItemsByIds(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Query() query: GetItemsByIdsQuery,
  ): Promise<GetItemsByIdsResponse> {
    const { itemIds } = query;
    const { items } = await lastValueFrom(
      this.itemService.getItemsByIds({ itemIds }),
    );
    return plainToClass(GetItemsByIdsResponse, { items });
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: GetItemsByUserIdDtoResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getUserWallets(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<GetItemsByUserIdDtoResponse> {
    const { userId } = claims;
    const { items } = await lastValueFrom(
      this.itemService.getItemsByUser({ userId }),
    );
    return plainToClass(GetItemsByUserIdDtoResponse, { items });
  }

  @Post('/marketplace')
  @ApiResponse({
    status: 200,
    type: GetMarketplaceResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getMarketplace(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<GetMarketplaceResponse> {
    const { userId } = claims;
    const { userWallets } = await lastValueFrom(
      this.userService.getWallets({ userId }),
    );
    const walletAddresses = userWallets.map((userWallet) => {
      const { address } = userWallet;
      return address;
    });
    const { items } = await lastValueFrom(
      this.itemService.getMarketplace({ walletAddresses }),
    );
    return plainToClass(GetMarketplaceResponse, { items });
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    type: CreateItemResponse,
    description: '{ data: {as type below} }',
  })
  async createItem(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: CreateItemRequest,
  ): Promise<CreateItemResponse> {
    const { item } = await lastValueFrom(
      this.itemService.createItem({ ...req, userId: claims.userId }),
    );
    return plainToClass(CreateItemResponse, { item });
  }

  @Post('/mint')
  @ApiResponse({
    status: 200,
    type: MintItemResponse,
    description: '{ data: {as type below} }',
  })
  async mintItem(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: MintItemRequest,
  ): Promise<MintItemResponse> {
    const { walletId, itemId } = req;
    const { item } = await lastValueFrom(
      this.itemService.mintItem({ walletId, itemId }),
    );
    return plainToClass(MintItemResponse, { item });
  }

  @Post('/change-owner')
  @ApiResponse({
    status: 200,
    type: MintItemResponse,
    description: '{ data: {as type below} }',
  })
  async changeOwnerItem(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: ChangeOwnerItemRequest,
  ): Promise<ChangeOwnerItemResponse> {
    const { walletId, itemId } = req;
    const { item } = await lastValueFrom(
      this.itemService.changeOwnerItem({ walletId, itemId }),
    );
    return plainToClass(ChangeOwnerItemResponse, { item });
  }
}
