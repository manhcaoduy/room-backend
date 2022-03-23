import * as grpc from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

import { EXCEPTION_PREFIX, EXCEPTION_SEPARATOR } from './exception.constant';
import { ExceptionInfo, Exception } from './exception.interface';

const grpcToHttpMapping = {
  [grpc.status.OK]: null,
  [grpc.status.CANCELLED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [grpc.status.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
  [grpc.status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [grpc.status.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
  [grpc.status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [grpc.status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [grpc.status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [grpc.status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
  [grpc.status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [grpc.status.FAILED_PRECONDITION]: HttpStatus.BAD_REQUEST,
  [grpc.status.ABORTED]: HttpStatus.CONFLICT,
  [grpc.status.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
  [grpc.status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [grpc.status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [grpc.status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  [grpc.status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export const encryptException = (exception: Exception): string => {
  return [
    EXCEPTION_PREFIX,
    exception.name,
    exception.message,
    JSON.stringify(exception.info),
  ].join(EXCEPTION_SEPARATOR);
};

export const decryptException = (details: string): Exception => {
  // err details has the format `{ERR_PREFIX}{SEPARATOR}{name}{SEPARATOR}{message}{SEPARATOR}{JSON of info}`
  const parts = details.split(EXCEPTION_SEPARATOR);
  if (parts.length !== 4 || parts[0] !== EXCEPTION_PREFIX) {
    throw new Error("failed parse experience's exception details");
  }
  let info: ExceptionInfo;
  try {
    info = JSON.parse(parts[3]);
  } catch (err) {
    throw new Error('failed to parse error details');
  }
  return {
    name: parts[1],
    message: parts[2],
    info,
  };
};

export const convertGrpcStatusToHttpStatus = (
  status: grpc.status,
): HttpStatus => {
  return grpcToHttpMapping[status];
};
