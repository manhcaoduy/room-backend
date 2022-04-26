import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';
import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';

@Exclude()
export class WalletEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  address: string;

  @Expose()
  network: WalletNetwork;

  @Expose()
  isOwned: boolean;

  @Expose()
  userId: string;

  @Expose()
  nonce: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<WalletEntity>) {
    Object.assign(this, init);
  }
}
