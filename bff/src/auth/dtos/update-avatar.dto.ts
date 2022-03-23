import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { UserDto } from '@app/microservice/models/user/user.dto';

export class UpdateAvatarRequest {
  @IsString()
  @ApiProperty({
    description: 'File url generated and uploaded to cloud',
  })
  fileUrl?: string;

  @IsString()
  @ApiProperty({
    description: 'File url generated and uploaded to cloud',
  })
  avatarUrl?: string;

  @IsString()
  @ApiProperty({
    description: 'File url generated and uploaded to cloud',
  })
  flatAvatarUrl?: string;

  constructor(partial: Partial<UpdateAvatarRequest>) {
    Object.assign(this, partial);
  }
}

export class UpdateAvatarResponse {
  @ApiProperty({
    description: 'User info',
  })
  user: UserDto;

  constructor(partial: Partial<UpdateAvatarResponse>) {
    Object.assign(this, partial);
  }
}
