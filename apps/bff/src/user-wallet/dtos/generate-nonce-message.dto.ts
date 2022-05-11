import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { getEnumNumberValues } from '@app/core/utils';

import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';
import { LowercaseWalletAddress } from '@app/core/utils/transform';

export class GenerateNonceMessageRequest {
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
  })
  network: WalletNetwork;

  constructor(partial: Partial<GenerateNonceMessageResponse>) {
    Object.assign(this, partial);
  }
}

export class GenerateNonceMessageResponse {
  @ApiProperty({
    description: 'one time password message to sign',
  })
  message: string;

  constructor(partial: Partial<GenerateNonceMessageResponse>) {
    Object.assign(this, partial);
  }
}
