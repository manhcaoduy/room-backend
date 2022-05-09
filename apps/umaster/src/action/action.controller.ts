import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import { ActionService } from './action.service';
import {
  ACTION_SERVICE_NAME,
  CreateActionRequest,
  CreateActionResponse,
  GetActionsRequest,
  GetActionsResponse,
} from '@app/microservice/proto/umaster/Action/v1/Action';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class ActionController {
  constructor(private readonly service: ActionService) {}

  @GrpcMethod(ACTION_SERVICE_NAME)
  async createAction(
    request: CreateActionRequest,
  ): Promise<CreateActionResponse> {
    const { userId, type, itemId, txHash, itemName } = request;
    const action = await this.service.createAction({
      userId,
      type,
      itemId,
      txHash,
      itemName,
    });
    return { action };
  }

  @GrpcMethod(ACTION_SERVICE_NAME)
  async getActions(request: GetActionsRequest): Promise<GetActionsResponse> {
    const { userId } = request;
    const actions = await this.service.getActions({ userId });
    return { actions };
  }
}
