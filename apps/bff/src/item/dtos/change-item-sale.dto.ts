import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ChangeItemSaleRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({
    description: 'is for sale',
  })
  isForSale: boolean;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    description: 'price',
  })
  price: number;

  constructor(partial: Partial<ChangeItemSaleRequest>) {
    Object.assign(this, partial);
  }
}

export class ChangeItemSaleResponse {
  @ApiProperty({
    description: 'item',
    type: () => ItemDto,
  })
  item: ItemDto;

  constructor(partial: Partial<ChangeItemSaleResponse>) {
    Object.assign(this, partial);
  }
}
