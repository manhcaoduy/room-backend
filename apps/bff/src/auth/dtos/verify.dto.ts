import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeEmail } from '@app/core/utils/email.utils';

export class VerifyTokenResponse {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'UserId',
  })
  userId: string;

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
