import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';

import { ItemEntity } from './item.entity';
import { Item } from './item.schema';

@Injectable()
export class ItemRepository extends BaseRepository<ItemEntity> {
  constructor() {
    super(Item, ItemEntity);
  }
}
