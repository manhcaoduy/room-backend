import { ApiProperty } from '@nestjs/swagger';
import { ItemFavoriteDto } from './item-favorite.dto';

export class CreateItemFavoriteRequest {
  @ApiProperty({})
  itemId: string;

  constructor(partial: Partial<CreateItemFavoriteRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateItemFavoriteResponse {
  @ApiProperty({
    type: () => ItemFavoriteDto,
  })
  item: ItemFavoriteDto;

  constructor(partial: Partial<CreateItemFavoriteResponse>) {
    Object.assign(this, partial);
  }
}
