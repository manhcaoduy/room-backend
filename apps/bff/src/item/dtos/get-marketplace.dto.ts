import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';

export class GetMarketplaceResponse {
  @ApiProperty({
    description: 'Item List',
    type: [ItemDto],
  })
  items: ItemDto[];

  constructor(partial: Partial<GetMarketplaceResponse>) {
    Object.assign(this, partial);
  }
}
