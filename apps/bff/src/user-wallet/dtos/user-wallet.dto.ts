import { ApiProperty } from '@nestjs/swagger';

import { WalletNetwork } from '@app/microservice/proto/shared/user/v1/user';
import { IsDefined, IsEnum } from 'class-validator';
import { getEnumNumberValues } from '@app/core/utils';

export class WalletDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  address: string;

  @IsDefined()
  @IsEnum(WalletNetwork)
  @ApiProperty({
    description: `User wallet type ${getEnumNumberValues(WalletNetwork)
      .map((t) => `${t}: ${WalletNetwork[t]}`)
      .join(', ')}`,
  })
  network: WalletNetwork;

  @ApiProperty({})
  isOwned: boolean;

  @ApiProperty({})
  userId: string;
}
