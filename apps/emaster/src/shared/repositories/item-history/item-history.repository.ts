import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';
import { ItemHistoryEntity } from './item-history.entity';
import { ItemHistory } from './item-history.schema';

@Injectable()
export class ItemHistoryRepository extends BaseRepository<ItemHistoryEntity> {
  constructor() {
    super(ItemHistory, ItemHistoryEntity);
  }
}
