/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.item.v1';

export enum ItemType {
  USER = 0,
  WALLET = 1,
}

export interface Item {
  id: string;
  owner: string;
  type: ItemType;
  metadataIpfs: string;
  isForSale: boolean;
  price: number;
  tokenId: number;
  marketItemId: number;
  createdAt: string;
  updatedAt: string;
}

export const SHARED_ITEM_V1_PACKAGE_NAME = 'shared.item.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
