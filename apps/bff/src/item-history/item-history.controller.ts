import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { EmasterGrpcServiceItemHistoryService } from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import {
  CurrentUser,
  JwtAccessTokenClaims,
} from '@app/microservice/http/jwt-auth';
import { lastValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ItemHistoryServiceClient } from '@app/microservice/proto/emaster/item_history/v1/item_history';
import {
  GetItemHistoriesRequest,
  GetItemHistoriesResponse,
} from './dto/get-histories.dto';
import {
  CreateHistoryRequest,
  CreateHistoryResponse,
} from './dto/create-history.dto';

@Controller('v1/item-history')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Item history')
@UseGuards(JwtAuthGuard)
export class ItemHistoryController {
  private logger: LoggerService;

  constructor(
    @Inject(EmasterGrpcServiceItemHistoryService)
    private readonly itemHistoryServiceClient: ItemHistoryServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(ItemHistoryController.name);
  }

  @Post('/get')
  @ApiResponse({
    status: 200,
    type: GetItemHistoriesResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getItemHistories(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: GetItemHistoriesRequest,
  ): Promise<GetItemHistoriesResponse> {
    const { itemId } = req;
    const { itemHistories } = await lastValueFrom(
      this.itemHistoryServiceClient.getItemHistory({ itemId }),
    );
    return plainToClass(GetItemHistoriesResponse, { itemHistories });
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    type: CreateHistoryResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async createItemHistory(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() req: CreateHistoryRequest,
  ): Promise<CreateHistoryResponse> {
    const { itemId, type, actor } = req;
    const { itemHistory } = await lastValueFrom(
      this.itemHistoryServiceClient.createItemHistory({ itemId, type, actor }),
    );
    return plainToClass(CreateHistoryResponse, { itemHistory });
  }
}
