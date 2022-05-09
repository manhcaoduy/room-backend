import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { schemaOptions } from '../schema-default.options';
import { ItemEntity } from './item.entity';
import { getEnumNumberValues } from '@app/core/utils';
import { ItemType } from '@app/microservice/proto/shared/item/v1/item';

const itemSchema = new Schema(
  {
    owner: Schema.Types.String,
    type: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(ItemType),
      default: ItemType.USER,
    },
    metadataIpfs: {
      type: Schema.Types.String,
      unique: true,
    },
    isForSale: {
      type: Schema.Types.Boolean,
      default: false,
    },
    price: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  schemaOptions,
);

export interface IItemDocument extends ItemEntity, Document {
  id: string;
}

export const Item =
  mongoose.models.Item || mongoose.model<IItemDocument>('item', itemSchema);
