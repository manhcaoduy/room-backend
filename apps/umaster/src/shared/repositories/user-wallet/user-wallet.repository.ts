import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';

import { UserWalletEntity } from './user-wallet.entity';
import { UserWallet } from './user-wallet.schema';

@Injectable()
export class UserWalletRepository extends BaseRepository<UserWalletEntity> {
  constructor() {
    super(UserWallet, UserWalletEntity);
  }
}
