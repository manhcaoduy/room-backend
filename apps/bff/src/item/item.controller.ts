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
import {
  GetWalletItemsQuery,
  GetWalletItemsResponse,
} from './dtos/get-items-by-wallet.dto';
import {
  ChangeItemSaleRequest,
  ChangeItemSaleResponse,
} from './dtos/change-item-sale.dto';
import {
  CheckOwnershipRequest,
  CheckOwnershipResponse,
} from './dtos/check-ownership.dto';

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

  @Get('/marketplace')
  @ApiResponse({
    status: 200,
    type: GetMarketplaceResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getMarketplace(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<GetMarketplaceResponse> {
    const { userId } = claims;
    const { items } = await lastValueFrom(
      this.itemService.getMarketplace({ userId }),
    );
    return plainToClass(GetMarketplaceResponse, { items });
  }

  @Get('/wallet')
  @ApiResponse({
    status: 200,
    type: GetWalletItemsResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getItemsByWallet(
    @Query() query: GetWalletItemsQuery,
  ): Promise<GetWalletItemsResponse> {
    const { walletAddress } = query;
    const { items } = await lastValueFrom(
      this.itemService.getItemsByWallet({ walletAddress }),
    );
    return plainToClass(GetWalletItemsResponse, { items });
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
    const { metadataIpfs, type } = req;
    const { item } = await lastValueFrom(
      this.itemService.createItem({
        metadataIpfs,
        type,
        userId: claims.userId,
      }),
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

  @Post('/change-item-sale')
  @ApiResponse({
    status: 200,
    type: ChangeItemSaleResponse,
    description: '{ data: {as type below} }',
  })
  async changeItemSale(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: ChangeItemSaleRequest,
  ): Promise<ChangeItemSaleResponse> {
    const { itemId, isForSale, price } = req;
    const { item } = await lastValueFrom(
      this.itemService.changeItemSale({ itemId, isForSale, price }),
    );
    return plainToClass(ChangeOwnerItemResponse, { item });
  }

  @Post('/check-ownership')
  @ApiResponse({
    status: 200,
    type: CheckOwnershipResponse,
    description: '{ data: {as type below} }',
  })
  async checkOwnership(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: CheckOwnershipRequest,
  ): Promise<CheckOwnershipResponse> {
    const { userId } = claims;
    const { itemId } = req;
    const { owned } = await lastValueFrom(
      this.itemService.checkOwnership({ userId, itemId }),
    );
    return plainToClass(CheckOwnershipResponse, { owned });
  }
}
