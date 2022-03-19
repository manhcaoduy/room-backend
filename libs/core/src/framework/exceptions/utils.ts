import * as grpc from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

import {
  ROVE_EXCEPTION_PREFIX,
  ROVE_EXCEPTION_SEPARATOR,
} from './exception.constant';
import { MoshExceptionInfo, RoveException } from './exception.interface';

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

export const encryptRoveException = (exception: RoveException): string => {
  return [
    ROVE_EXCEPTION_PREFIX,
    exception.name,
    exception.message,
    JSON.stringify(exception.info),
  ].join(ROVE_EXCEPTION_SEPARATOR);
};

export const decryptRoveException = (details: string): RoveException => {
  // err details has the format `{ERR_PREFIX}{SEPARATOR}{name}{SEPARATOR}{message}{SEPARATOR}{JSON of info}`
  const parts = details.split(ROVE_EXCEPTION_SEPARATOR);
  if (parts.length !== 4 || parts[0] !== ROVE_EXCEPTION_PREFIX) {
    throw new Error("failed parse experience's exception details");
  }
  let info: MoshExceptionInfo;
  try {
    info = JSON.parse(parts[3]);
  } catch (err) {
    throw new Error("failed to parse mosh's error details");
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
