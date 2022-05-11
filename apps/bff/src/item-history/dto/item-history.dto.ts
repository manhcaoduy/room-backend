import { ApiProperty } from '@nestjs/swagger';
import { HistoryType } from '@app/microservice/proto/shared/item_history/v1/item_history';

export class ItemHistoryDto {
  @ApiProperty({})
  itemId: string;

  @ApiProperty({})
  actor: string;

  @ApiProperty({})
  type: HistoryType;

  constructor(partial: Partial<ItemHistoryDto>) {
    Object.assign(this, partial);
  }
}
