import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckItemFavoriteRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({})
  itemId: string;

  constructor(partial: Partial<CheckItemFavoriteRequest>) {
    Object.assign(this, partial);
  }
}

export class CheckItemFavoriteResponse {
  @IsBoolean()
  isFavorite: boolean;

  constructor(partial: Partial<CheckItemFavoriteResponse>) {
    Object.assign(this, partial);
  }
}
