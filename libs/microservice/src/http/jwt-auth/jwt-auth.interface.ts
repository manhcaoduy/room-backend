export interface JwtAccessTokenClaims {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface JwtRefreshTokenClaims {
  userId: string;
  iat: number;
  exp: number;
}
