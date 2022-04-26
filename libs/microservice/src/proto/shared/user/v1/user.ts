/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.user.v1';

export enum WalletNetwork {
  EVM = 0,
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  address: string;
  network: WalletNetwork;
  isOwned: boolean;
  userId: string;
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
