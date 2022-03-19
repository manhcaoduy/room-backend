import { status as grpcStatus } from '@grpc/grpc-js';

export const ROVE_EXCEPTION_SEPARATOR = '$$';
export const ROVE_EXCEPTION_PREFIX = 'ROVE_ERROR';
export const DEFAULT_GRPC_RETRIED_ERROR_CODE = [
  grpcStatus.CANCELLED,
  grpcStatus.UNKNOWN,
  grpcStatus.UNAVAILABLE,
  grpcStatus.INTERNAL,
];
