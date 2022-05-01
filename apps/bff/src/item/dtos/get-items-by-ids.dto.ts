import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const stringQueryParser = (data) => {
  let result: string[] = [];
  if (data.value) {
    result = data.value
      .split(',')
      .map((val: string) => val.trim())
      .filter((val: string) => val);
  }
  return result;
};

export class GetItemsByIdsQuery {
  @IsString({ each: true })
  @Transform(stringQueryParser)
  @ApiProperty({
    required: false,
    description: 'User Ids, seperated by comma',
    type: String,
  })
  itemIds: string[];

  constructor(partial: Partial<GetItemsByIdsQuery>) {
    Object.assign(this, partial);
  }
}

export class GetItemsByIdsResponse {
  @ApiProperty({
    description: 'Item List',
    type: [ItemDto],
  })
  items: ItemDto[];

  constructor(partial: Partial<GetItemsByIdsResponse>) {
    Object.assign(this, partial);
  }
}
