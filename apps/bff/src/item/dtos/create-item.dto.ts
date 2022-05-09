import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '@app/microservice/proto/shared/item/v1/item';
import { ItemDto } from './item.dto';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { getEnumNumberValues } from '@app/core/utils';

export class CreateItemRequest {
  @IsDefined()
  @IsEnum(ItemType)
  @ApiProperty({
    description: `Item type ${getEnumNumberValues(ItemType)
      .map((t) => `${t}: ${ItemType[t]}`)
      .join(', ')}`,
  })
  type: ItemType;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'metadata ipfs',
  })
  metadataIpfs: string;

  constructor(partial: Partial<CreateItemRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateItemResponse {
  @ApiProperty({
    description: 'item',
    type: () => ItemDto,
  })
  item: ItemDto;

  constructor(partial: Partial<CreateItemResponse>) {
    Object.assign(this, partial);
  }
}
