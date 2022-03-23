import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import slugify from 'slugify';

import { UserAgoraDto } from '@app/microservice/models/user/user-agora.dto';
import { UserGender } from '@app/microservice/proto/shared/user/v1/user';

export class UpdateProfileRequest {
  @IsString()
  @ApiProperty({
    description: 'User username',
  })
  @IsNotEmpty()
  @Transform(({ value }) => slugify(value))
  username: string;

  @IsString()
  @ApiProperty({
    description: 'User date of birth',
  })
  dob: string;

  @IsNumber()
  @ApiProperty({
    description: 'User gender',
  })
  gender: UserGender;

  @IsString()
  @ApiProperty({
    description: 'User country',
  })
  country: string;

  @IsNumber()
  @ApiProperty({
    description: 'User timezone',
  })
  timezone: number;

  constructor(partial: Partial<UpdateProfileRequest>) {
    Object.assign(this, partial);
  }
}

export class UpdateProfileResponse {
  @ApiProperty({
    description: 'User info',
  })
  user: UserAgoraDto;

  constructor(partial: Partial<UpdateProfileResponse>) {
    Object.assign(this, partial);
  }
}
