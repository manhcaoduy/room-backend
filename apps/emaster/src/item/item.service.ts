import { Inject, Injectable } from '@nestjs/common';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';
import { ItemEntity, ItemRepository } from '../shared/repositories/item';
import { ItemType } from '@app/microservice/proto/shared/item/v1/item';
import { GrpcDataLossException } from '@app/core/framework/exceptions/grpc-exception';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';
import { UMasterGrpcServiceUserService } from '@app/microservice/constants/microservice';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ItemService {
  private logger: LoggerService;

  constructor(
    private itemRepository: ItemRepository,
    private readonly loggerFactory: LoggerFactoryService,
    @Inject(UMasterGrpcServiceUserService)
    private readonly userServiceClient: UserServiceClient,
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
    const { userWallets } = await lastValueFrom(
      this.userServiceClient.getWallets({ userId }),
    );
    const walletAddresses = userWallets.map((userWallet) => userWallet.address);

    const userItems = await this.itemRepository.find({
      type: ItemType.USER,
      owner: userId,
    });

    const walletItems = await this.itemRepository.find({
      type: ItemType.WALLET,
      owner: { $in: walletAddresses },
    });

    return [...userItems, ...walletItems];
  }

  async getMarketplace(request: { userId: string }): Promise<ItemEntity[]> {
    const { userId } = request;
    const { userWallets } = await lastValueFrom(
      this.userServiceClient.getWallets({ userId }),
    );
    const walletAddresses = userWallets.map((userWallet) => userWallet.address);
    const items = await this.itemRepository.find({
      type: ItemType.WALLET,
      owner: { $nin: walletAddresses },
    });
    return items;
  }

  async getItemsByWallet(request: {
    walletAddress: string;
  }): Promise<ItemEntity[]> {
    const { walletAddress } = request;
    const items = await this.itemRepository.find({
      type: ItemType.WALLET,
      owner: walletAddress,
    });
    return items;
  }

  async checkOwnership(request: {
    userId: string;
    itemId: string;
  }): Promise<boolean> {
    const { userId, itemId } = request;
    const { owner } = await this.itemRepository.findOne({ id: itemId });
    const { userWallets } = await lastValueFrom(
      this.userServiceClient.getWallets({ userId }),
    );
    let owned = false;
    userWallets.forEach((userWallet) => {
      const { address } = userWallet;
      if (address === owner) {
        owned = true;
      }
    });
    if (owner === userId) {
      owned = true;
    }
    return owned;
  }

  async changeItemSale(request: {
    itemId: string;
    isForSale: boolean;
    price: number;
  }): Promise<ItemEntity> {
    const { itemId, isForSale, price } = request;
    const item = await this.itemRepository.updateOneAndReturn(
      { itemId },
      { isForSale, price },
    );
    return item;
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
