import { ApiProperty } from '@nestjs/swagger';

import { UserWalletDto } from './user-wallet.dto';

export class GetUserWalletsResponse {
  @ApiProperty({
    description: 'list of wallets',
    type: [UserWalletDto],
  })
  userWallets: UserWalletDto;

  constructor(partial: Partial<GetUserWalletsResponse>) {
    Object.assign(this, partial);
  }
}
