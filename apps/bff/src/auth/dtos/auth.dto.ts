import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'User access token',
  })
  accessToken: string;
  @ApiProperty({
    description: 'User refresh token',
  })
  refreshToken: string;

  constructor(partial: Partial<AuthResponse>) {
    Object.assign(this, partial);
  }
}
