import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class RemoveItemFavoriteRequest {
  @IsString()
  @IsDefined()
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
