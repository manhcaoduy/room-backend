import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { schemaOptions } from '../schema-default.options';
import { ItemFavoriteEntity } from './item-favorite.entity';

const itemFavoriteSchema = new Schema(
  {
    itemId: Schema.Types.String,
    userId: Schema.Types.String,
  },
  schemaOptions,
);

export interface IItemFavoriteDocument extends ItemFavoriteEntity, Document {
  id: string;
}

export const ItemFavorite =
  mongoose.models.ItemFavorite ||
  mongoose.model<IItemFavoriteDocument>('item_favorite', itemFavoriteSchema);
