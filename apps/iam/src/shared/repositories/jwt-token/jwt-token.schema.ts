import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { getEnumNumberValues } from '@app/core/utils';

import { schemaOptions } from '../schema-default.options';
import {
  EJwtTokenStatus,
  EJwtTokenType,
  JwtTokenEntity,
} from './jwt-token.entity';

const jwtTokenSchema = new Schema(
  {
    _id: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.String,
      required: true,
    },
    type: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(EJwtTokenType),
      default: EJwtTokenType.AccessToken,
    },
    status: {
      type: Schema.Types.Number,
      enum: getEnumNumberValues(EJwtTokenStatus),
      default: EJwtTokenType.AccessToken,
    },
  },
  {
    ...schemaOptions,
    collection: 'jwt_tokens',
  },
);

export interface IJwtTokenSchema extends JwtTokenEntity, Document {
  id: string;
}

export const JwtToken =
  mongoose.models.JwtToken ||
  mongoose.model<IJwtTokenSchema>('JwtToken', jwtTokenSchema);
