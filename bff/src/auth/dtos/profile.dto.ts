import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UserDto } from '@app/microservice/models/user/user.dto';

export class ProfileResponse {
  @ApiProperty({
    description: 'User info',
  })
  @Type(() => UserDto)
  user: UserDto;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}
