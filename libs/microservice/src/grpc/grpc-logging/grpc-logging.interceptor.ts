import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import * as uuid from 'uuid';

import { RoveStatuses } from '@app/core/framework/exceptions/exception.enum';
import { RoveGrpcException } from '@app/core/framework/exceptions/grpc-exception';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { DEFAULT_OPTIONS, GRPC_LOGGING_OPTIONS } from './grpc-logging.constant';
import { GrpcLoggingOptions } from './grpc-logging.type';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private logger: LoggerService;
  private logResponse: boolean;

  constructor(
    @Inject(GRPC_LOGGING_OPTIONS) options: GrpcLoggingOptions,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(GrpcLoggingInterceptor.name);
    if (options.logResponse === undefined) {
      this.logResponse = DEFAULT_OPTIONS.logResponse;
    } else {
      this.logResponse = options.logResponse;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerName = context.getHandler().name;
    const controllerName = context?.getClass()?.name || 'GrpcController';
    const requestData = context.switchToRpc().getData();
    const startTime = process.hrtime();

    const requestId = uuid.v4();

    const loggingData = {
      requestId,
      request: {
        handlerName,
        controllerName,
        data: requestData,
      },
    };
    this.logger.debug(
      `Incoming gRPC request to ${controllerName}.${handlerName}`,
      loggingData,
    );

    return next.handle().pipe(
      tap((data) => {
        if (this.logResponse) {
          loggingData['response'] = data;
        }
        this.logger.info(
          `gRPC request to ${controllerName}.${handlerName} succeeded`,
          {
            ...loggingData,
            status: RoveStatuses.Succeed,
            durationMs: getDurationInMilliseconds(startTime),
          },
        );
      }),
      catchError((err) => {
        const dataLog = {
          ...loggingData,
          durationMs: getDurationInMilliseconds(startTime),
          status: RoveStatuses.Failed,
        };

        const failedMsg = `gRPC request to ${controllerName}.${handlerName} failed`;
        if (err instanceof RoveGrpcException) {
          this.logger.error(failedMsg, dataLog, err);
        } else {
          this.logger.critical(failedMsg, dataLog, err);
        }
        return throwError(() => err);
      }),
    );
  }
}

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
