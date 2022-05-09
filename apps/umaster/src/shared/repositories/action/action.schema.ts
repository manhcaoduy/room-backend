import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { getEnumNumberValues } from '@app/core/utils';

import { schemaOptions } from '../schema-default.options';
import { ActionType } from '@app/microservice/proto/shared/action/v1/action';
import { ActionEntity } from './action.entity';

const ActionSchema = new Schema(
  {
    userId: Schema.Types.String,
    itemId: Schema.Types.String,
    itemName: Schema.Types.String,
    type: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(ActionType),
      default: ActionType.BUY,
    },
    txHash: Schema.Types.String,
  },
  {
    ...schemaOptions,
    collection: 'user_actions',
  },
);

export interface IActionDocument extends ActionEntity, Document {
  id: string;
}

export const Action =
  mongoose.models.Action ||
  mongoose.model<IActionDocument>('Action', ActionSchema);
