import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@app/microservice/proto/shared/user/v1/user';

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

export class PublicAuthResponse extends AuthResponse {
  @ApiProperty({
    description: 'User id',
  })
  userId: string;

  constructor(partial: Partial<PublicAuthResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class UserAccessTokenClaims {
  userId: string;
  roles: UserRole[];
  email: string;

  constructor(partial: Partial<UserAccessTokenClaims>) {
    Object.assign(this, partial);
  }
}

export class UserRefreshTokenClaims {
  userId: string;

  constructor(partial: Partial<UserRefreshTokenClaims>) {
    Object.assign(this, partial);
  }
}
