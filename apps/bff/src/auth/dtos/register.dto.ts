import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { normalizeEmail } from '@app/core/utils/email.utils';
import { UserGender } from '@app/microservice/proto/shared/user/v1/user';

export class RegisterRequest {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Username',
  })
  username: string;

  @IsNumber()
  @ApiProperty({
    description: 'User gender',
  })
  gender: UserGender;

  constructor(partial: Partial<RegisterRequest>) {
    Object.assign(this, partial);
  }
}

export class RegisterResponse {
  @ApiProperty({
    description: 'User access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User refresh token',
  })
  refreshToken: string;

  constructor(partial: Partial<RegisterResponse>) {
    Object.assign(this, partial);
  }
}
