import { Exclude, Expose } from 'class-transformer';
import { ItemType } from '@app/microservice/proto/shared/item/v1/item';

@Exclude()
export class UserItemEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  userId: string;

  @Expose()
  type: ItemType;

  @Expose()
  link: string;

  public constructor(init?: Partial<UserItemEntity>) {
    Object.assign(this, init);
  }
}
