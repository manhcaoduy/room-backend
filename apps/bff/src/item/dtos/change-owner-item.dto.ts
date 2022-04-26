import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { IsNotEmpty } from 'class-validator';

export class ChangeOwnerItemRequest {
  @IsNotEmpty()
  @ApiProperty({
    description: 'wallet id',
  })
  walletId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;

  constructor(partial: Partial<ChangeOwnerItemRequest>) {
    Object.assign(this, partial);
  }
}

export class ChangeOwnerItemResponse {
  @ApiProperty({
    description: 'item',
    type: () => ItemDto,
  })
  item: ItemDto;

  constructor(partial: Partial<ChangeOwnerItemResponse>) {
    Object.assign(this, partial);
  }
}
