import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import {
  EmasterGrpcServiceItemFavoriteService,
} from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import { ItemFavoriteServiceClient } from '@app/microservice/proto/emaster/item_favorite/v1/item_favorite';
import { GetItemsByUserIdDtoResponse } from '../item/dtos/get-items-by-user-id.dto';
import {
  CurrentUser,
  JwtAccessTokenClaims,
} from '@app/microservice/http/jwt-auth';
import { lastValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { GetItemFavoritesResponse } from './dtos/get-favorite-items.dto';
import {
  CreateItemFavoriteRequest,
  CreateItemFavoriteResponse,
} from './dtos/create-favorite-item.dto';
import {
  RemoveItemFavoriteRequest,
  RemoveItemFavoriteResponse,
} from './dtos/remove-favorite-item.dto';
import {
  CheckItemFavoriteRequest,
  CheckItemFavoriteResponse,
} from './dtos/check-favorite-item.dto';

@Controller('v1/item-favorite')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Item favorite')
@UseGuards(JwtAuthGuard)
export class ItemFavoriteController {
  private logger: LoggerService;

  constructor(
    @Inject(EmasterGrpcServiceItemFavoriteService)
    private readonly itemFavoriteServiceClient: ItemFavoriteServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(ItemFavoriteController.name);
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: GetItemFavoritesResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getItemFavorites(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<GetItemsByUserIdDtoResponse> {
    const { userId } = claims;
    const { items } = await lastValueFrom(
      this.itemFavoriteServiceClient.getItemFavorites({ userId }),
    );
    return plainToClass(GetItemsByUserIdDtoResponse, { items });
  }

  @Post('/check')
  @ApiResponse({
    status: 200,
    type: CheckItemFavoriteResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async checkItemFavorite(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: CheckItemFavoriteRequest,
  ): Promise<CheckItemFavoriteResponse> {
    const { userId } = claims;
    const { itemId } = req;
    const { isFavorite } = await lastValueFrom(
      this.itemFavoriteServiceClient.checkFavorite({ userId, itemId }),
    );
    return plainToClass(CheckItemFavoriteResponse, { isFavorite });
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    type: CreateItemFavoriteResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async createItemFavorite(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: CreateItemFavoriteRequest,
  ): Promise<CreateItemFavoriteResponse> {
    const { userId } = claims;
    const { itemId } = req;
    const { item } = await lastValueFrom(
      this.itemFavoriteServiceClient.createItemFavorite({ userId, itemId }),
    );
    return plainToClass(CreateItemFavoriteResponse, { item });
  }

  @Post('/remove')
  @ApiResponse({
    status: 200,
    type: RemoveItemFavoriteResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async removeItemFavorite(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: RemoveItemFavoriteRequest,
  ): Promise<RemoveItemFavoriteResponse> {
    const { userId } = claims;
    const { itemId } = req;
    const { result } = await lastValueFrom(
      this.itemFavoriteServiceClient.removeItemFavorite({ userId, itemId }),
    );
    return plainToClass(RemoveItemFavoriteResponse, { result });
  }
}
