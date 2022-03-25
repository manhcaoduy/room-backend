import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { normalizeEmail } from '@app/core/utils/email.utils';
import { Transform } from 'class-transformer';

export class LoginRequest {
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
    description: 'password',
  })
  password: string;

  constructor(partial: Partial<LoginRequest>) {
    Object.assign(this, partial);
  }
}

export class LoginResponse {
  @ApiProperty({
    description: 'User access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User refresh token',
  })
  refreshToken: string;

  constructor(partial: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
}
