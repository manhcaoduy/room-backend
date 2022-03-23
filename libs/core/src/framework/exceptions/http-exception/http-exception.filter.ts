import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import {
  ERROR_CODES,
  Statuses,
} from '@app/core/framework/exceptions/exception.enum';

import { RoveHttpException } from './http-exception';

interface MoshError {
  message: string;
  code: string;
}

export interface ErrorResponse {
  status: Statuses;
  error: MoshError;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      err instanceof HttpException
        ? err.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let customCode = ERROR_CODES.PROBLEM_WITH_REQUEST;
    if (err instanceof RoveHttpException) {
      customCode = err.info?.code ? err.info.code : customCode;
    }

    if (err instanceof HttpException) {
      response.status(status).send(<ErrorResponse>{
        status: Statuses.Failed,
        error: {
          message: err.message,
          code: customCode,
        },
      });
      return;
    }

    response.status(status).send(<ErrorResponse>{
      status: Statuses.Failed,
      error: {
        message: 'something went wrong on our end!',
        code: ERROR_CODES.SERVER_ERROR,
      },
    });
  }
}
