import { Expose } from 'class-transformer';

export enum EJwtTokenType {
  AccessToken = 0,
  RefreshToken = 1,
}

export enum EJwtTokenStatus {
  InActive = 0,
  Active = 1,
}

export class JwtTokenEntity {
  @Expose({ name: '_id' })
  id: string;
  userId: string;
  type: EJwtTokenType;
  status: EJwtTokenStatus;
}
