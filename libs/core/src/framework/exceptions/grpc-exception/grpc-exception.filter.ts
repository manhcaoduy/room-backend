import * as grpc from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

import { ROVE_ERROR_CODES } from '@app/core/framework/exceptions/exception.enum';
import { encryptRoveException } from '@app/core/framework/exceptions/utils';

import { RoveGrpcException } from './grpc-exception';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let customCode = ROVE_ERROR_CODES.SERVER_ERROR;
    let grpcCode = grpc.status.INTERNAL;
    let message = 'something went wrong on our end';
    let name = 'Internal Server Error';
    let metadata = null;

    if (exception instanceof RoveGrpcException) {
      customCode =
        exception.info?.code || ROVE_ERROR_CODES.PROBLEM_WITH_REQUEST;
      message = exception.message;
      name = exception.name;
      grpcCode = exception.grpcCode;
      metadata = exception.info?.metadata;
    } else {
      if (exception?.code && exception?.message) {
        const rpcException = new RpcException({
          code: exception.code,
          message: exception.message,
        });
        return throwError(() => rpcException.getError());
      }
    }

    const rpcExceptionMessage = encryptRoveException({
      name,
      message,
      info: {
        code: customCode,
        metadata,
      },
    });

    const rpcException = new RpcException({
      code: grpcCode,
      message: rpcExceptionMessage,
    });

    return throwError(() => rpcException.getError());
  }
}
