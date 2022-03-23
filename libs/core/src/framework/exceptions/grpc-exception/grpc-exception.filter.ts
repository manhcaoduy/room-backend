import * as grpc from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

import { ERROR_CODES } from '@app/core/framework/exceptions/exception.enum';
import { encryptException } from '@app/core/framework/exceptions/utils';

import { GrpcException } from './grpc-exception';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let customCode = ERROR_CODES.SERVER_ERROR;
    let grpcCode = grpc.status.INTERNAL;
    let message = 'something went wrong on our end';
    let name = 'Internal Server Error';
    let metadata = null;

    if (exception instanceof GrpcException) {
      customCode = exception.info?.code || ERROR_CODES.PROBLEM_WITH_REQUEST;
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

    const rpcExceptionMessage = encryptException({
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
