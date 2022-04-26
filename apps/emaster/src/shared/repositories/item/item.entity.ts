import { Exclude, Expose } from 'class-transformer';
import { ItemType } from '@app/microservice/proto/shared/item/v1/item';

@Exclude()
export class ItemEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  owner: string;
  @Expose()
  type: ItemType;
  @Expose()
  metadataIpfs: string;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<ItemEntity>) {
    Object.assign(this, init);
  }
}
