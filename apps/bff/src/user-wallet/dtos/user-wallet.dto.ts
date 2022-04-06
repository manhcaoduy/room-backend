import { ApiProperty } from '@nestjs/swagger';

import { UserWalletType } from '@app/microservice/proto/shared/user/v1/user';

export class UserWalletDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  userId: string;

  @ApiProperty({})
  address: string;

  @ApiProperty({})
  type: UserWalletType;
}
