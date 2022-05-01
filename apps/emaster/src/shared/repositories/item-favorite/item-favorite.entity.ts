import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ItemFavoriteEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  itemId: string;
  @Expose()
  userId: string;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<ItemFavoriteEntity>) {
    Object.assign(this, init);
  }
}
