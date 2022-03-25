import { Injectable } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';

import {
  EJwtTokenStatus,
  EJwtTokenType,
  JwtTokenEntity,
} from './jwt-token.entity';
import { JwtToken } from './jwt-token.schema';

@Injectable()
export class JwtTokenRepository extends BaseRepository<JwtTokenEntity> {
  constructor() {
    super(JwtToken, JwtTokenEntity);
  }

  public async saveToken(userId: string, token: string, type: EJwtTokenType) {
    await this.MongooseModel.updateOne(
      { _id: token },
      {
        $setOnInsert: {
          _id: token,
          userId,
          type,
          status: EJwtTokenStatus.Active,
        },
      } as UpdateQuery<JwtTokenEntity>,
      { upsert: true },
    );
  }

  getUserIdByToken = async (token: string): Promise<string | null> => {
    const userJwt = await this.findOne({ _id: token });
    if (userJwt) {
      return userJwt.userId;
    }
    return null;
  };

  /**
   * removeUserTokens remove all token of one users.
   */
  removeUserTokens = async (userId: string) => {
    await this.delete({ userId: userId });
  };
}
