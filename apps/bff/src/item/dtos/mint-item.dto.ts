import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { IsNotEmpty } from 'class-validator';

export class MintItemRequest {
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

  constructor(partial: Partial<MintItemRequest>) {
    Object.assign(this, partial);
  }
}

export class MintItemResponse {
  @ApiProperty({
    description: 'item',
    type: () => ItemDto,
  })
  item: ItemDto;

  constructor(partial: Partial<MintItemResponse>) {
    Object.assign(this, partial);
  }
}
