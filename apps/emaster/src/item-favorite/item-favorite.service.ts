import { Injectable } from '@nestjs/common';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';
import {
  ItemFavoriteEntity,
  ItemFavoriteRepository,
} from '../shared/repositories/item-favorite';
import {
  GrpcAlreadyExistException,
  GrpcNotFoundException,
} from '@app/core/framework/exceptions/grpc-exception';

@Injectable()
export class ItemFavoriteService {
  private logger: LoggerService;

  constructor(
    private itemFavoriteRepository: ItemFavoriteRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(ItemFavoriteService.name);
  }

  async getItemFavorites(request: {
    userId: string;
  }): Promise<ItemFavoriteEntity[]> {
    const { userId } = request;
    const itemFavorites = await this.itemFavoriteRepository.find({ userId });
    return itemFavorites;
  }

  async createItemFavorite(request: {
    itemId: string;
    userId: string;
  }): Promise<ItemFavoriteEntity> {
    const { itemId, userId } = request;
    const existedItemFavorite = await this.itemFavoriteRepository.findOne({
      itemId,
      userId,
    });
    if (existedItemFavorite) {
      throw new GrpcAlreadyExistException('item favorite already existed');
    }
    const itemFavorite = await this.itemFavoriteRepository.create({
      itemId,
      userId,
    });
    return itemFavorite;
  }

  async removeItemFavorite(request: {
    itemId: string;
    userId: string;
  }): Promise<boolean> {
    const { itemId, userId } = request;
    const existedItemFavorite = await this.itemFavoriteRepository.findOne({
      itemId,
      userId,
    });
    if (!existedItemFavorite) {
      throw new GrpcNotFoundException('item favorite not found');
    }
    await this.itemFavoriteRepository.delete({ itemId, userId });
    return true;
  }
}
