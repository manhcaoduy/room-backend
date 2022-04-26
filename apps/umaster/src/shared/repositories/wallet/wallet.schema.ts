import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { getEnumNumberValues } from '@app/core/utils';

import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';

import { schemaOptions } from '../schema-default.options';
import { WalletEntity } from './wallet.entity';

const WalletSchema = new Schema(
  {
    address: Schema.Types.String,
    network: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(WalletNetwork),
      default: WalletNetwork.EVM,
    },
    isOwned: Schema.Types.Boolean,
    userId: Schema.Types.String,
    nonce: {
      type: Schema.Types.String,
      default: '0',
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    ...schemaOptions,
    collection: 'wallets',
  },
);

export interface IWalletDocument extends WalletEntity, Document {
  id: string;
}

export const Wallet =
  mongoose.models.Wallet ||
  mongoose.model<IWalletDocument>('Wallet', WalletSchema);
