import { ApiProperty } from '@nestjs/swagger';

import { ItemType } from '@app/microservice/proto/shared/item/v1/item';
import { IsBoolean, IsDefined, IsEnum, IsNumber } from 'class-validator';
import { getEnumNumberValues } from '@app/core/utils';

export class ItemDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  owner: string;

  @IsDefined()
  @IsEnum(ItemType)
  @ApiProperty({
    description: `Item type ${getEnumNumberValues(ItemType)
      .map((t) => `${t}: ${ItemType[t]}`)
      .join(', ')}`,
  })
  type: ItemType;

  @ApiProperty({})
  metadataIpfs: string;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  isForSale: boolean;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  tokenId: number;

  constructor(partial: Partial<ItemDto>) {
    Object.assign(this, partial);
  }
}
