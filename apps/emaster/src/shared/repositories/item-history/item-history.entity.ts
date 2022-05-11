import { Exclude, Expose } from 'class-transformer';
import { HistoryType } from '@app/microservice/proto/shared/item_history/v1/item_history';

@Exclude()
export class ItemHistoryEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  itemId: string;
  @Expose()
  actor: string;
  @Expose()
  type: HistoryType;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<ItemHistoryEntity>) {
    Object.assign(this, init);
  }
}
