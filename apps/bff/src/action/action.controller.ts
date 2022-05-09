import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { JwtAuthGuard } from '@app/microservice/http/jwt-auth/jwt-auth.guards';
import {
  CurrentUser,
  JwtAccessTokenClaims,
} from '@app/microservice/http/jwt-auth';
import { lastValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UmasterGrpcServiceActionService } from '@app/microservice/constants/microservice';
import { ActionServiceClient } from '@app/microservice/proto/umaster/action/v1/action';
import { GetActionsByUserIdResponse } from './dtos/get-actions.dto';
import {
  CreateActionRequest,
  CreateActionResponse,
} from './dtos/create-action.dto';

@Controller('v1/action')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Action')
@UseGuards(JwtAuthGuard)
export class ActionController {
  private logger: LoggerService;

  constructor(
    @Inject(UmasterGrpcServiceActionService)
    private readonly client: ActionServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(ActionController.name);
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: GetActionsByUserIdResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async getTransactions(
    @CurrentUser() claims: JwtAccessTokenClaims,
  ): Promise<GetActionsByUserIdResponse> {
    const { userId } = claims;
    const { actions } = await lastValueFrom(this.client.getActions({ userId }));
    return plainToClass(GetActionsByUserIdResponse, { actions });
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    type: CreateActionResponse,
    description: '{ status: 1: data: {as type below} }',
  })
  async createTransaction(
    @CurrentUser() claims: JwtAccessTokenClaims,
    @Body() request: CreateActionRequest,
  ): Promise<CreateActionResponse> {
    const { userId } = claims;
    const { itemId, type, txHash, itemName } = request;
    const { action } = await lastValueFrom(
      this.client.createAction({ userId, itemId, type, txHash, itemName }),
    );
    return plainToClass(CreateActionResponse, { action });
  }
}
