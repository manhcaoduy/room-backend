import * as grpc from '@grpc/grpc-js';

import { ExceptionInfo, Exception } from '../exception.interface';

export class GrpcException extends Error implements Exception {
  // Exception requires name, message, but they are already declared in Error.
  public readonly info: ExceptionInfo | null;

  // Extra grpcCode.
  public readonly grpcCode: grpc.status;

  public constructor(
    name: string,
    grpcCode: grpc.status,
    message: string,
    info: ExceptionInfo | null = null,
  ) {
    super(message);
    this.name = name;
    this.grpcCode = grpcCode;
    this.info = info;
  }
}

export class GrpcCanceledException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Canceled', grpc.status.CANCELLED, message, info);
  }
}

export class GrpcUnkownException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Unknown', grpc.status.UNKNOWN, message, info);
  }
}

export class GrpcInvalidArgumentException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Invalid Argument', grpc.status.INVALID_ARGUMENT, message, info);
  }
}

export class GrpcDeadlineExceededException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Deadline Exceeded', grpc.status.DEADLINE_EXCEEDED, message, info);
  }
}

export class GrpcNotFoundException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Not Found', grpc.status.NOT_FOUND, message, info);
  }
}

export class GrpcAlreadyExistException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Already Exist', grpc.status.ALREADY_EXISTS, message, info);
  }
}

export class GrpcPermissionDeniedException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Permission Denied', grpc.status.PERMISSION_DENIED, message, info);
  }
}

export class GrpcUnauthenticatedException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Unauthenticated', grpc.status.UNAUTHENTICATED, message, info);
  }
}

export class GrpcResourceExhaustedException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Resource Exhausted', grpc.status.RESOURCE_EXHAUSTED, message, info);
  }
}

export class GrpcFailedPreconditionException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super(
      'Failed Precondition',
      grpc.status.FAILED_PRECONDITION,
      message,
      info,
    );
  }
}

export class GrpcAbortedException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Aborted', grpc.status.ABORTED, message, info);
  }
}

export class GrpcOutOfRangeException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Out of Range', grpc.status.OUT_OF_RANGE, message, info);
  }
}

export class GrpcUnimplementedException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Unimplemented', grpc.status.UNIMPLEMENTED, message, info);
  }
}

export class GrpcInternalException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Internal', grpc.status.INTERNAL, message, info);
  }
}

export class GrpcUnavailableException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Unavailable', grpc.status.UNAVAILABLE, message, info);
  }
}

export class GrpcDataLossException extends GrpcException {
  public constructor(message: string, info: ExceptionInfo | null = null) {
    super('Data Loss', grpc.status.DATA_LOSS, message, info);
  }
}
