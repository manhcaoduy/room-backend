/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.item_history.v1';

export enum HistoryType {
  CREATE = 0,
  MINT = 1,
  ENABLE = 2,
  CANCELED = 3,
  BUY = 4,
}

export interface ItemHistory {
  itemId: string;
  actor: string;
  type: HistoryType;
}

export const SHARED_ITEM_HISTORY_V1_PACKAGE_NAME = 'shared.item_history.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
