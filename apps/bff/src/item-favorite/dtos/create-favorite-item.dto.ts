import { ApiProperty } from '@nestjs/swagger';
import { ItemFavoriteDto } from './item-favorite.dto';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateItemFavoriteRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
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
