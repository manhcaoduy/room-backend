import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { getEnumNumberValues } from '@app/core/utils';

import { UserWalletType } from '@app/microservice/proto/shared/user/v1/user';

import { schemaOptions } from '../schema-default.options';
import { UserWalletEntity } from './user-wallet.entity';

const UserWalletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      ref: 'User',
      index: true,
    },
    address: Schema.Types.String,
    type: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(UserWalletType),
      default: UserWalletType.EVM,
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    nonce: {
      type: Schema.Types.String,
      default: '0',
    },
  },
  {
    ...schemaOptions,
    collection: 'user_wallets',
  },
);

export interface IUserWalletDocument extends UserWalletEntity, Document {
  id: string;
}

export const UserWallet =
  mongoose.models.UserWallet ||
  mongoose.model<IUserWalletDocument>('UserWallet', UserWalletSchema);
