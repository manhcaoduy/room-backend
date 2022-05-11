import { Injectable } from '@nestjs/common';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';




import { HistoryType } from '@app/microservice/proto/shared/item_history/v1/item_history';
import {
  ItemHistoryEntity,
  ItemHistoryRepository,
} from '../shared/repositories/item-history';

@Injectable()
export class ItemHistoryService {
  private logger: LoggerService;

  constructor(
    private itemHistoryRepository: ItemHistoryRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(ItemHistoryService.name);
  }

  async createItemHistory(request: {
    itemId: string;
    type: HistoryType;
    actor: string;
  }): Promise<ItemHistoryEntity> {
    const { itemId, type, actor } = request;
    const itemHistory = await this.itemHistoryRepository.create({
      itemId,
      type,
      actor,
    });
    return itemHistory;
  }

  async getItemHistories(request: {
    itemId: string;
  }): Promise<ItemHistoryEntity[]> {
    const { itemId } = request;
    const itemHistories = await this.itemHistoryRepository.find({
      itemId,
    });
    return itemHistories;
  }
}
