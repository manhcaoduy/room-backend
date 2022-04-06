import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';

import { UserWalletType } from '@app/microservice/proto/shared/user/v1/user';

@Exclude()
export class UserWalletEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  userId: string;

  @Expose()
  address: string;

  @Expose()
  type: UserWalletType;

  @Expose()
  isVerified: boolean;

  @Expose()
  nonce: string;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<UserWalletEntity>) {
    Object.assign(this, init);
  }
}
