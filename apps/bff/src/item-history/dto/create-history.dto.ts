import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { getEnumNumberValues } from '@app/core/utils';
import { HistoryType } from '@app/microservice/proto/shared/item_history/v1/item_history';
import { ItemHistoryDto } from './item-history.dto';

export class CreateHistoryRequest {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'actor',
  })
  actor: string;

  @IsDefined()
  @IsEnum(HistoryType)
  @ApiProperty({
    description: `Action type ${getEnumNumberValues(HistoryType)
      .map((t) => `${t}: ${HistoryType[t]}`)
      .join(', ')}`,
  })
  type: HistoryType;

  constructor(partial: Partial<CreateHistoryRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateHistoryResponse {
  @ApiProperty({
    description: 'Action',
    type: () => ItemHistoryDto,
  })
  itemHistory: ItemHistoryDto;

  constructor(partial: Partial<CreateHistoryResponse>) {
    Object.assign(this, partial);
  }
}
