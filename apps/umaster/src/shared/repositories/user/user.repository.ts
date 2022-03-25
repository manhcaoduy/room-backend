import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';

import { UserEntity } from './user.entity';
import { User } from './user.schema';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(User, UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({
      email,
    });
  }

  async findById(userId: string): Promise<UserEntity> {
    return await this.findOne({
      _id: userId,
    });
  }

  async findByIds(userIds: string[]): Promise<UserEntity[]> {
    return this.find({
      _id: { $in: userIds },
    });
  }
}
