/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.user.v1';

export enum UserWalletType {
  EVM = 0,
}

export enum UserGender {
  ANOTHER = 0,
  FEMALE = 1,
  MALE = 2,
}

export interface UserProfile {
  username: string;
  gender: UserGender;
}

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  gender: UserGender;
  createdAt: string;
  updatedAt: string;
}

export interface UserWallet {
  id: string;
  userId: string;
  address: string;
  type: UserWalletType;
  nonce: string;
  createdAt: string;
  updatedAt: string;
}

export const SHARED_USER_V1_PACKAGE_NAME = 'shared.user.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
