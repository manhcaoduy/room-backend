import { Injectable } from '@nestjs/common';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';
import { ItemEntity, ItemRepository } from '../shared/repositories/item';
import { ItemType } from '@app/microservice/proto/shared/item/v1/item';
import { GrpcDataLossException } from '@app/core/framework/exceptions/grpc-exception';

@Injectable()
export class ItemService {
  private logger: LoggerService;

  constructor(
    private itemRepository: ItemRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(ItemService.name);
  }

  async getItemsByIds(request: { itemIds: string[] }): Promise<ItemEntity[]> {
    const { itemIds } = request;
    const items = await this.itemRepository.find({
      _id: { $in: itemIds },
    });
    if (items.length !== itemIds.length) {
      throw new GrpcDataLossException('there are ids that not existed');
    }
    return items;
  }

  async getItemsByUser(request: { userId: string }): Promise<ItemEntity[]> {
    const { userId } = request;
    const items = await this.itemRepository.find({
      userId,
    });
    return items;
  }

  async getMarketplace(request: {
    walletAddresses: string[];
  }): Promise<ItemEntity[]> {
    const { walletAddresses } = request;
    const items = await this.itemRepository.find({
      type: ItemType.WALLET,
      owner: { $nin: walletAddresses },
    });
    return items;
  }

  async createItem(request: {
    userId: string;
    type: ItemType;
    metadataIpfs: string;
  }): Promise<ItemEntity> {
    const { userId, type, metadataIpfs } = request;
    const item = await this.itemRepository.create({
      owner: userId,
      type,
      metadataIpfs,
    });
    return item;
  }

  async mintItem(request: {
    walletId: string;
    itemId: string;
  }): Promise<ItemEntity> {
    const { walletId, itemId } = request;
    const item = await this.itemRepository.updateOneAndReturn(
      { itemId },
      {
        owner: walletId,
        type: ItemType.WALLET,
      },
    );
    return item;
  }

  async changeOwnerItem(request: {
    walletId: string;
    itemId: string;
  }): Promise<ItemEntity> {
    const { walletId, itemId } = request;
    const item = await this.itemRepository.updateOneAndReturn(
      { itemId },
      {
        owner: walletId,
        type: ItemType.WALLET,
      },
    );
    return item;
  }
}
