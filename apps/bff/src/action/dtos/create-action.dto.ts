import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { getEnumNumberValues } from '@app/core/utils';
import { ActionType } from '@app/microservice/proto/shared/action/v1/action';
import { ActionDto } from './action.dto';

export class CreateActionRequest {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'item name',
  })
  itemName: string;

  @IsDefined()
  @IsEnum(ActionType)
  @ApiProperty({
    description: `Action type ${getEnumNumberValues(ActionType)
      .map((t) => `${t}: ${ActionType[t]}`)
      .join(', ')}`,
  })
  type: ActionType;

  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'Action hash',
  })
  txHash: string;

  constructor(partial: Partial<CreateActionRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateActionResponse {
  @ApiProperty({
    description: 'Action',
    type: () => ActionDto,
  })
  action: ActionDto;

  constructor(partial: Partial<CreateActionResponse>) {
    Object.assign(this, partial);
  }
}
