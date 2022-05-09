import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';
import { getEnumNumberValues } from '@app/core/utils';
import { ActionType } from '@app/microservice/proto/shared/action/v1/action';

export class ActionDto {
  @ApiProperty({})
  userId: string;

  @ApiProperty({})
  itemId: string;

  @IsDefined()
  @IsEnum(ActionType)
  @ApiProperty({
    description: `Action type ${getEnumNumberValues(ActionType)
      .map((t) => `${t}: ${ActionType[t]}`)
      .join(', ')}`,
  })
  type: ActionType;

  @ApiProperty({})
  txHash: string;

  constructor(partial: Partial<ActionDto>) {
    Object.assign(this, partial);
  }
}
