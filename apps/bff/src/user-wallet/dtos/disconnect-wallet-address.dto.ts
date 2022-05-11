import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { getEnumNumberValues } from '@app/core/utils';
import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';
import { WalletDto } from './user-wallet.dto';
import { LowercaseWalletAddress } from '@app/core/utils/transform';

export class DisconnectWalletAddressRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @LowercaseWalletAddress()
  @ApiProperty({
    description: 'wallet address',
  })
  walletAddress: string;

  @IsDefined()
  @IsEnum(WalletNetwork)
  @ApiProperty({
    description: `User wallet type ${getEnumNumberValues(WalletNetwork)
      .map((t) => `${t}: ${WalletNetwork[t]}`)
      .join(', ')}`,
    type: Number,
  })
  network: WalletNetwork;

  constructor(partial: Partial<DisconnectWalletAddressRequest>) {
    Object.assign(this, partial);
  }
}

export class DisconnectWalletAddressResponse {
  @ApiProperty({
    description: 'user wallet info',
  })
  userWallet: WalletDto;

  constructor(partial: Partial<DisconnectWalletAddressResponse>) {
    Object.assign(this, partial);
  }
}
