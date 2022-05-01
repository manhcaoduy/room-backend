import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';

export class GetItemsByUserIdDtoResponse {
  @ApiProperty({
    description: 'Item List',
    type: [ItemDto],
  })
  items: ItemDto[];

  constructor(partial: Partial<GetItemsByUserIdDtoResponse>) {
    Object.assign(this, partial);
  }
}
