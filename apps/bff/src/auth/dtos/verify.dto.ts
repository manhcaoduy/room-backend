import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeEmail } from '@app/core/utils/email.utils';

export class VerifyTokenRequest {
  @ApiProperty({
    description: 'User access token',
  })
  accessToken: string;

  constructor(partial: Partial<VerifyTokenRequest>) {
    Object.assign(this, partial);
  }
}

export class VerifyTokenResponse {
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
    description: 'Username',
  })
  username: string;

  constructor(partial: Partial<VerifyTokenResponse>) {
    Object.assign(this, partial);
  }
}
