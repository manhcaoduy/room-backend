import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';
import { LowercaseWalletAddress } from '@app/core/utils/transform';

export class MintItemRequest {
  @IsNotEmpty()
  @LowercaseWalletAddress()
  @ApiProperty({
    description: 'wallet address',
  })
  walletAddress: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    description: 'token id',
  })
  tokenId: number;

  constructor(partial: Partial<MintItemRequest>) {
    Object.assign(this, partial);
  }
}

export class MintItemResponse {
  @ApiProperty({
    description: 'item',
    type: () => ItemDto,
  })
  item: ItemDto;

  constructor(partial: Partial<MintItemResponse>) {
    Object.assign(this, partial);
  }
}
