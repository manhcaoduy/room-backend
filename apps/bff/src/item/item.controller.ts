import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { EMasterGrpcServiceItemService } from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import { ItemServiceClient } from '@app/microservice/proto/emaster/item/v1/item';
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

@Controller('v1/item')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  private logger: LoggerService;

  constructor(
    @Inject(EMasterGrpcServiceItemService)
    private readonly itemService: ItemServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(ItemController.name);
  }

  @Post('/create-item')
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

  @Post('/mint-item')
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
