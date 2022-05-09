/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.action.v1';

export enum ActionType {
  CREATE = 0,
  MINT = 1,
  SELL = 2,
  BUY = 3,
}

export interface Action {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  type: ActionType;
  txHash: string;
  createdAt: string;
  updatedAt: string;
}

export const SHARED_ACTION_V1_PACKAGE_NAME = 'shared.action.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
