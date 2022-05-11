import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { schemaOptions } from '../schema-default.options';
import { getEnumNumberValues } from '@app/core/utils';
import { HistoryType } from '@app/microservice/proto/shared/item_history/v1/item_history';
import { ItemHistoryEntity } from './item-history.entity';

const itemHistorySchema = new Schema(
  {
    itemId: Schema.Types.String,
    actor: Schema.Types.String,
    type: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(HistoryType),
      default: HistoryType.CREATE,
    },
  },
  schemaOptions,
);

export interface IItemHistoryDocument extends ItemHistoryEntity, Document {
  id: string;
}

export const ItemHistory =
  mongoose.models.ItemHistory ||
  mongoose.model<IItemHistoryDocument>('item_history', itemHistorySchema);
