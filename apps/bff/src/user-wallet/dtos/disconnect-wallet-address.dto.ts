import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { getEnumNumberValues } from '@app/core/utils';

import { UserWalletType } from '@app/microservice/proto/shared/user/v1/user';

export class DisconnectWalletAddressRequest {
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

  constructor(partial: Partial<DisconnectWalletAddressRequest>) {
    Object.assign(this, partial);
  }
}

export class DisconnectWalletAddressResponse {
  @ApiProperty({
    description: 'result',
  })
  result: boolean;

  constructor(partial: Partial<DisconnectWalletAddressResponse>) {
    Object.assign(this, partial);
  }
}
