import { ApiProperty } from '@nestjs/swagger';

import { WalletDto } from './user-wallet.dto';

export class GetUserWalletsResponse {
  @ApiProperty({
    description: 'list of wallets',
    type: [WalletDto],
  })
  userWallets: WalletDto[];

  constructor(partial: Partial<GetUserWalletsResponse>) {
    Object.assign(this, partial);
  }
}
