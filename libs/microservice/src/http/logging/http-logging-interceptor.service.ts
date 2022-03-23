import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { Statuses } from '@app/core/framework/exceptions/exception.enum';
import { RoveHttpException } from '@app/core/framework/exceptions/http-exception/http-exception';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { REQUEST_ID_TOKEN_HEADER } from '@app/microservice/http/constants';
import { JwtAccessTokenClaims } from '@app/microservice/http/jwt-auth/jwt-auth.interface';

import {
  DEFAULT_OPTIONS,
  HTTP_LOGGING_ASYNC_OPTIONS,
  HTTP_LOGGING_STATIC_OPTIONS,
} from './http-logging.constant';
import {
  HttpLoggingAsyncOptions,
  HttpLoggingStaticOptions,
} from './http-logging.type';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;
  private readonly excludeRoutePrefixes: string[];
  private readonly logResponse: boolean;

  constructor(
    @Inject(HTTP_LOGGING_STATIC_OPTIONS)
    staticOptions: HttpLoggingStaticOptions,
    @Inject(HTTP_LOGGING_ASYNC_OPTIONS) asyncOptions: HttpLoggingAsyncOptions,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(HttpLoggingInterceptor.name);
    this.excludeRoutePrefixes = staticOptions.excludedRoutePrefixes;
    if (asyncOptions.logResponse === undefined) {
      this.logResponse = DEFAULT_OPTIONS.logResponse;
    } else {
      this.logResponse = asyncOptions.logResponse;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp()?.getRequest();
    const url = req?.url;
    const caller = req?.user as JwtAccessTokenClaims;
    for (const pathPrefix of this.excludeRoutePrefixes) {
      if (url.startsWith(pathPrefix)) {
        return next.handle();
      }
    }
    const startTime = process.hrtime();

    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    const clientIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const referer = req.headers['referer'];
    const userAgent = req.headers['user-agent'];

    const path = req?.route?.path ? req.route.path : req.url;
    const requestData = {
      path,
      method: req?.method,
      query: req.query,
      params: req.params,
      body: req.body,
    };
    this.logger.debug(`Incoming ${req?.method} request to ${path}`, {
      requestId,
      request: {
        ...requestData,
      },
      userId: caller?.userId,
    });

    const loggingData = {
      requestId,
      userId: caller?.userId,
      request: {
        metadata: {
          clientIp,
          referer,
          userAgent,
        },
        ...requestData,
      },
    };

    return next.handle().pipe(
      tap((data) => {
        if (this.logResponse) {
          loggingData['response'] = data;
        }
        this.logger.info(`${req?.method} request to ${path} succeeded`, {
          ...loggingData,
          durationMs: getDurationInMilliseconds(startTime),
          status: Statuses.Succeed,
        });
      }),
      catchError((err) => {
        const dataLog = {
          ...loggingData,
          durationMs: getDurationInMilliseconds(startTime),
          status: Statuses.Failed,
        };

        if (err instanceof RoveHttpException) {
          this.logger.warn(
            `${req?.method} request to ${path} failed`,
            dataLog,
            err,
          );
        } else {
          this.logger.critical(
            `${req?.method} request to ${path} failed`,
            dataLog,
            err,
          );
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
