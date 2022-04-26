import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserPublicInfo {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
}

@Exclude()
export class UserEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  email: string;
  @Expose()
  password: string;
  @Expose()
  username: string;

  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;

  public constructor(init?: Partial<UserEntity>) {
    Object.assign(this, init);
  }
}
