import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionInfo, Exception } from '../exception.interface';

export class RoveHttpException extends HttpException implements Exception {
  // RoveException requires name, message and RoveHttpException needs extra httpCode.
  // They are already declared in HttpException.
  public readonly info: ExceptionInfo | null;

  constructor(
    name: string,
    httpCode: HttpStatus,
    message: string,
    info: ExceptionInfo | null = null,
  ) {
    super(message, httpCode);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.info = info;
    Error.captureStackTrace(this);
  }
}

export class HttpInvalidInputException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super('Invalid Input Exception', HttpStatus.BAD_REQUEST, message, info);
  }
}

export class HttpUnauthorizedException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super('Unauthorized Exception', HttpStatus.UNAUTHORIZED, message, info);
  }
}

export class HttpPermissionDeniedException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super('Permission Denied Exception', HttpStatus.FORBIDDEN, message, info);
  }
}

export class HttpConflictException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super('Conflict Exception', HttpStatus.CONFLICT, message, info);
  }
}

export class HttpNotFoundException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super('Not Found Exception', HttpStatus.NOT_FOUND, message, info);
  }
}

export class HttpUnprocessableException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super(
      'Not Found Exception',
      HttpStatus.UNPROCESSABLE_ENTITY,
      message,
      info,
    );
  }
}

export class HttpPayloadTooLargeException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super(
      'Payload Too Large Exception',
      HttpStatus.PAYLOAD_TOO_LARGE,
      message,
      info,
    );
  }
}

export class HttpUnsupportedMediaTypeException extends RoveHttpException {
  constructor(message: string, info: ExceptionInfo | null = null) {
    super(
      'Unsupported Media Type Exception',
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      message,
      info,
    );
  }
}
