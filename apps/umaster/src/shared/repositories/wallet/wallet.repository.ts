import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';

import { WalletEntity } from './wallet.entity';
import { Wallet } from './wallet.schema';
import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';

@Injectable()
export class WalletRepository extends BaseRepository<WalletEntity> {
  constructor() {
    super(Wallet, WalletEntity);
  }

  async getOrCreate(req: {
    address: string;
    network: WalletNetwork;
  }): Promise<WalletEntity> {
    const wallet = await this.findOne(req);
    if (wallet) {
      return wallet;
    }
    const createdWallet = await this.create(req);
    return createdWallet;
  }
}
