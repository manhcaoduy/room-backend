import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GrpcExceptionFilter } from '@app/core/framework/exceptions/grpc-exception';

import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import {
  ChangeOwnerItemRequest,
  ChangeOwnerItemResponse,
  CreateItemRequest,
  CreateItemResponse,
  ITEM_SERVICE_NAME,
  MintItemRequest,
  MintItemResponse,
} from '@app/microservice/proto/emaster/item/v1/item';

import { ItemService } from './item.service';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @GrpcMethod(ITEM_SERVICE_NAME)
  async createItem(request: CreateItemRequest): Promise<CreateItemResponse> {
    const item = await this.itemService.createItem(request);
    return { item };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async mintItem(request: MintItemRequest): Promise<MintItemResponse> {
    const item = await this.itemService.mintItem(request);
    return { item };
  }

  @GrpcMethod(ITEM_SERVICE_NAME)
  async changeOwnerItem(
    request: ChangeOwnerItemRequest,
  ): Promise<ChangeOwnerItemResponse> {
    const item = await this.itemService.changeOwnerItem(request);
    return { item };
  }
}
