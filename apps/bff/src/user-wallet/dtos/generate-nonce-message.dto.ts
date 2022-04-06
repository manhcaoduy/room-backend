import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { getEnumNumberValues } from '@app/core/utils';

import { UserWalletType } from '@app/microservice/proto/shared/user/v1/user';

export class GenerateNonceMessageRequest {
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
  })
  type: UserWalletType;

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
