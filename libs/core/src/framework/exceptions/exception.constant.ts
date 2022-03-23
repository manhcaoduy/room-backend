import { status as grpcStatus } from '@grpc/grpc-js';

export const EXCEPTION_SEPARATOR = '$$';
export const EXCEPTION_PREFIX = 'ERROR';
export const DEFAULT_GRPC_RETRIED_ERROR_CODE = [
  grpcStatus.CANCELLED,
  grpcStatus.UNKNOWN,
  grpcStatus.UNAVAILABLE,
  grpcStatus.INTERNAL,
];
