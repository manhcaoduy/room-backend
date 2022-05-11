import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import { GrpcMethod } from '@nestjs/microservices';
import { ItemHistoryService } from './item-history.service';
import {
  CreateItemHistoryRequest,
  CreateItemHistoryResponse,
  GetItemHistoryRequest,
  GetItemHistoryResponse,
  ITEM_HISTORY_SERVICE_NAME,
} from '@app/microservice/proto/emaster/item_history/v1/item_history';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class ItemHistoryController {
  constructor(private readonly itemHistoryService: ItemHistoryService) {}

  @GrpcMethod(ITEM_HISTORY_SERVICE_NAME)
  async createItemHistory({
    itemId,
    type,
    actor,
  }: CreateItemHistoryRequest): Promise<CreateItemHistoryResponse> {
    const itemHistory = await this.itemHistoryService.createItemHistory({
      itemId,
      type,
      actor,
    });
    return { itemHistory };
  }

  @GrpcMethod(ITEM_HISTORY_SERVICE_NAME)
  async getItemHistory({
    itemId,
  }: GetItemHistoryRequest): Promise<GetItemHistoryResponse> {
    const itemHistories = await this.itemHistoryService.getItemHistories({
      itemId,
    });
    return { itemHistories };
  }
}
