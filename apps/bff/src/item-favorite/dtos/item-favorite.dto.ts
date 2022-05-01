import { ApiProperty } from '@nestjs/swagger';

export class ItemFavoriteDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  itemId: string;

  @ApiProperty({})
  userId: string;

  constructor(partial: Partial<ItemFavoriteDto>) {
    Object.assign(this, partial);
  }
}
