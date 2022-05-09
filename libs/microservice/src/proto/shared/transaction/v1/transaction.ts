/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'shared.transaction.v1';

export enum TransactionType {
  CREATE = 0,
  MINT = 1,
  SELL = 2,
  BUY = 3,
}

export interface Transaction {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  txHash: string;
  createdAt: string;
  updatedAt: string;
}

export const SHARED_TRANSACTION_V1_PACKAGE_NAME = 'shared.transaction.v1';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
