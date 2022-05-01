/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.item_favorite.v1';

export interface ItemFavorite {
  id: string;
  itemId: string;
  userId: string;
}

export const SHARED_ITEM_FAVORITE_V1_PACKAGE_NAME = 'shared.item_favorite.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
