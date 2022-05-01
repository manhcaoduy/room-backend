import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';
import { ItemFavoriteEntity } from './item-favorite.entity';
import { ItemFavorite } from './item-favorite.schema';

@Injectable()
export class ItemFavoriteRepository extends BaseRepository<ItemFavoriteEntity> {
  constructor() {
    super(ItemFavorite, ItemFavoriteEntity);
  }
}
