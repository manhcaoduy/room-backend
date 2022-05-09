import { Exclude, Expose } from 'class-transformer';
import { ActionType } from '@app/microservice/proto/shared/action/v1/action';

@Exclude()
export class ActionEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  userId: string;

  @Expose()
  itemId: string;

  @Expose()
  itemName: string;

  @Expose()
  type: ActionType;

  @Expose()
  txHash: string;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<ActionEntity>) {
    Object.assign(this, init);
  }
}
