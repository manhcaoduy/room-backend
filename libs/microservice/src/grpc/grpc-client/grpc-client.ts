import { Inject, Injectable } from '@nestjs/common';
import {
  ClientGrpc,
  ClientGrpcProxy,
  RpcException,
} from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RoveHttpException } from '@app/core/framework/exceptions/http-exception';
import {
  convertGrpcStatusToHttpStatus,
  decryptException,
} from '@app/core/framework/exceptions/utils';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import {
  CLIENT_ASYNC_OPTIONS,
  CLIENT_STATIC_OPTIONS,
} from './client-grpc.constant';
import { GrpcClientInterceptorFactory } from './client-grpc.interceptors';
import {
  ClientGrpcAsyncOptions,
  ClientGrpcStaticOptions,
} from './client-grpc.type';

@Injectable()
export class GrpcClient extends ClientGrpcProxy implements ClientGrpc {
  private readonly usingHttpError: boolean;
  private expLogger: LoggerService;

  constructor(
    @Inject(CLIENT_STATIC_OPTIONS) staticOptions: ClientGrpcStaticOptions,
    @Inject(CLIENT_ASYNC_OPTIONS) asyncOptions: ClientGrpcAsyncOptions,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    // Add retry interceptor if `maxRetries` is given in the options.
    super(
      Object.assign({}, asyncOptions.options, {
        channelOptions: asyncOptions.maxRetries
          ? {
              interceptors: [
                GrpcClientInterceptorFactory.retryInterceptorFactory(
                  {
                    maxRetries: asyncOptions.maxRetries,
                  },
                  loggerFactory,
                ),
              ] as any,
            }
          : undefined,
      }),
    );
    this.usingHttpError = staticOptions.usingHttpError;
    this.expLogger = this.loggerFactory.createLogger(GrpcClient.name);
  }

  // extends ClientGrpcProxy, reimplement getService method
  // follow nest's implementation at https://github.com/nestjs/nest/blob/master/packages/microservices/client/client-grpc.ts
  // wrap serviceMethod to parse response data and catch grpc error
  public getService<T extends {}>(name: string): T {
    const grpcClient = this.createClientByServiceName(name);
    const clientRef = this.getClient(name);
    if (!clientRef) {
      throw new Error(`Invalid Grpc Service ${name}`);
    }
    const protoMethods = Object.keys(clientRef[name].prototype);
    const grpcService = {} as T;
    protoMethods.forEach((m) => {
      const key = m[0].toLowerCase() + m.slice(1, m.length);
      const serviceMethod = this.createServiceMethod(grpcClient, m);
      grpcService[key] = this.wrap.bind(this, serviceMethod, name, m);
    });
    return grpcService;
  }

  private wrap(
    fn: Function,
    serviceName: string,
    methodName: string,
    ...args: any[]
  ): any {
    const ret: Observable<unknown> = fn.apply(this, args);
    return ret.pipe(
      // handle receive response from grpc services
      map((data: any) => {
        return data;
      }),
      // handle receive error from grpc services
      catchError((err) => {
        const loggingData = {
          methodName,
          serviceName,
          details: err.details,
          code: err.code,
        };
        this.expLogger.error(
          `Failed to call grpc to method ${serviceName}.${methodName}`,
          loggingData,
        );

        if (!err.code || !err.details) {
          return throwError(() => err);
        }

        if (!this.usingHttpError) {
          const rpcException = new RpcException({
            code: err.code,
            message: err.details,
          });
          return throwError(() => rpcException.getError());
        }

        try {
          const httpCode = convertGrpcStatusToHttpStatus(err.code);
          const { name, message, info } = decryptException(err.details);

          return throwError(
            () => new RoveHttpException(name, httpCode, message, info),
          );
        } catch (parseError) {
          return throwError(() => err);
        }
      }),
    );
  }
}
