import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { normalizeEmail } from '@app/core/utils/email.utils';

export class VerifyOtpRequest {
  @ApiProperty({
    description:
      'New user email to get otp for verification (if user want to change the email)',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email?: string;

  constructor(partial: Partial<VerifyOtpRequest>) {
    Object.assign(this, partial);
  }
}

export class VerifyOtpResponse {
  @ApiProperty({
    description: 'result',
  })
  result: boolean;

  constructor(partial: Partial<VerifyOtpResponse>) {
    Object.assign(this, partial);
  }
}

export class CompleteVerifyEmailRequest {
  @ApiProperty({
    description:
      'New user email to verify account (if user want to change the email)',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Otp code',
  })
  otp: string;

  constructor(partial: Partial<CompleteVerifyEmailRequest>) {
    Object.assign(this, partial);
  }
}
