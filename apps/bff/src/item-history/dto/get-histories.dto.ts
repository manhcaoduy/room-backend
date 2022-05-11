import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ItemHistoryDto } from './item-history.dto';

export class GetItemHistoriesRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;
}

export class GetItemHistoriesResponse {
  @ApiProperty({
    description: 'item histories',
    type: [ItemHistoryDto],
  })
  itemHistories: ItemHistoryDto[];

  constructor(partial: Partial<GetItemHistoriesResponse>) {
    Object.assign(this, partial);
  }
}
