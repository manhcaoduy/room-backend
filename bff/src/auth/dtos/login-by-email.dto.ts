import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { normalizeEmail } from '@app/core/utils/email.utils';

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

  constructor(partial: Partial<LoginRequest>) {
    Object.assign(this, partial);
  }
}

export class LoginResponse {
  @ApiProperty({
    description: 'Result',
  })
  result: boolean;

  @ApiProperty({})
  isNewUser: boolean;

  constructor(partial: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
}

export class CompleteLoginRequest {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'User username',
  })
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Otp code',
  })
  otp: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Source from seo, website, autonomous, v.v...',
    required: false,
  })
  source?: string;

  constructor(partial: Partial<LoginRequest>) {
    Object.assign(this, partial);
  }
}
