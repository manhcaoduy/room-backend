import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CheckOwnershipRequest {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    description: 'item id',
  })
  itemId: string;

  constructor(partial: Partial<CheckOwnershipRequest>) {
    Object.assign(this, partial);
  }
}

export class CheckOwnershipResponse {
  @IsBoolean()
  @ApiProperty({
    description: 'owned',
  })
  owned: boolean;

  constructor(partial: Partial<CheckOwnershipResponse>) {
    Object.assign(this, partial);
  }
}
