import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { getEnumNumberValues } from '@app/core/utils';

import { UserWalletType } from '@app/microservice/proto/shared/user/v1/user';

import { UserWalletDto } from './user-wallet.dto';

export class ConnectWalletAddressRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    description: 'wallet address',
  })
  walletAddress: string;

  @IsDefined()
  @IsEnum(UserWalletType)
  @ApiProperty({
    description: `User wallet type ${getEnumNumberValues(UserWalletType)
      .map((t) => `${t}: ${UserWalletType[t]}`)
      .join(', ')}`,
    type: Number,
  })
  type: UserWalletType;

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
  userWallet: UserWalletDto;

  constructor(partial: Partial<ConnectWalletAddressResponse>) {
    Object.assign(this, partial);
  }
}
