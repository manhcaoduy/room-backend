import { ApiProperty } from '@nestjs/swagger';

export class RemoveItemFavoriteRequest {
  @ApiProperty({})
  itemId: string;

  constructor(partial: Partial<RemoveItemFavoriteRequest>) {
    Object.assign(this, partial);
  }
}

export class RemoveItemFavoriteResponse {
  @ApiProperty({})
  result: boolean;

  constructor(partial: Partial<RemoveItemFavoriteResponse>) {
    Object.assign(this, partial);
  }
}
