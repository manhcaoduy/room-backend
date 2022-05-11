import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { getEnumNumberValues } from '@app/core/utils';

import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';

import { WalletDto } from './user-wallet.dto';
import { LowercaseWalletAddress } from '@app/core/utils/transform';

export class ConnectWalletAddressRequest {
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
    description: `Wallet network ${getEnumNumberValues(WalletNetwork)
      .map((t) => `${t}: ${WalletNetwork[t]}`)
      .join(', ')}`,
    type: Number,
  })
  network: WalletNetwork;

  @ApiProperty({
    description: 'signature',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  signature: string;

  constructor(partial: Partial<ConnectWalletAddressRequest>) {
    Object.assign(this, partial);
  }
}

export class ConnectWalletAddressResponse {
  @ApiProperty({
    description: 'user wallet info',
  })
  userWallet: WalletDto;

  constructor(partial: Partial<ConnectWalletAddressResponse>) {
    Object.assign(this, partial);
  }
}
