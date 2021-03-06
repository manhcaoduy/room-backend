import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { LowercaseWalletAddress } from '@app/core/utils/transform';

export class GetWalletItemsQuery {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @LowercaseWalletAddress()
  @ApiProperty({
    required: false,
    description: 'Wallet Address',
    type: String,
  })
  walletAddress: string;

  constructor(partial: Partial<GetWalletItemsQuery>) {
    Object.assign(this, partial);
  }
}

export class GetWalletItemsResponse {
  @ApiProperty({
    description: 'Item List',
    type: [ItemDto],
  })
  items: ItemDto[];

  constructor(partial: Partial<GetWalletItemsResponse>) {
    Object.assign(this, partial);
  }
}
