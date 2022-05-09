import { ApiProperty } from '@nestjs/swagger';
import { ActionDto } from './action.dto';

export class GetActionsByUserIdResponse {
  @ApiProperty({
    description: 'Actions',
    type: [ActionDto],
  })
  actions: ActionDto[];

  constructor(partial: Partial<GetActionsByUserIdResponse>) {
    Object.assign(this, partial);
  }
}
