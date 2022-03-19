/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.user.v1';

export enum UserGender {
  ANOTHER = 0,
  FEMALE = 1,
  MALE = 2,
}

export interface UserProfile {
  username: string;
  fullName: string;
  gender: UserGender;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  gender: UserGender;
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
