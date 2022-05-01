import { ItemFavoriteDto } from './item-favorite.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetItemFavoritesResponse {
  @ApiProperty({
    type: [ItemFavoriteDto],
  })
  items: ItemFavoriteDto[];

  constructor(partial: Partial<GetItemFavoritesResponse>) {
    Object.assign(this, partial);
  }
}
