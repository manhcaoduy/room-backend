import { Injectable } from '@nestjs/common';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';
import { ItemRepository } from '../shared/repositories/item';
import { Item, ItemType } from '@app/microservice/proto/shared/item/v1/item';

@Injectable()
export class ItemService {
  private logger: LoggerService;

  constructor(
    private itemRepository: ItemRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(ItemService.name);
  }

  async createItem(request: {
    userId: string;
    type: ItemType;
    metadataIpfs: string;
  }): Promise<Item> {
    const { userId, type, metadataIpfs } = request;
    const item = await this.itemRepository.create({
      owner: userId,
      type,
      metadataIpfs,
    });
    return item;
  }

  async mintItem(request: { walletId: string; itemId: string }): Promise<Item> {
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
  }): Promise<Item> {
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
