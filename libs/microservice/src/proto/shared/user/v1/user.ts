/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.user.v1';

export enum UserGender {
  ANOTHER = 0,
  FEMALE = 1,
  MALE = 2,
}

export enum ItemType {
  IMAGE = 0,
  VIDEO = 1,
  GIF = 2,
}

export interface Item {
  id: string;
  type: ItemType;
  link: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  UserGender: UserGender;
  avatar: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserItem {
  id: string;
  userId: string;
  item?: Item;
}

export const SHARED_USER_V1_PACKAGE_NAME = 'shared.user.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
