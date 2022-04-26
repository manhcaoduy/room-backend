import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { caseInsensitiveOption } from '@app/core/dal/repositories/schema-default.options';

import { schemaOptions } from '../schema-default.options';
import { UserEntity } from './user.entity';

const userSchema = new Schema(
  {
    email: { type: Schema.Types.String, unique: true },
    password: Schema.Types.String,
    username: {
      type: Schema.Types.String,
    },
  },
  schemaOptions,
);

userSchema.index({ username: 1 }, { unique: true, ...caseInsensitiveOption });

export interface IUserDocument extends UserEntity, Document {
  id: string;
}

export const User =
  mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
