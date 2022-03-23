import {
  InterceptingCall,
  InterceptorOptions,
  Listener,
  Metadata,
  Requester,
  StatusObject,
  status,
} from '@grpc/grpc-js';

import { DEFAULT_GRPC_RETRIED_ERROR_CODE } from '@app/core/framework/exceptions/exception.constant';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';

export interface RetryInterceptorOption {
  maxRetries?: number;
  retriedGrpcStatusCode?: status[];
}

// follow retry interceptor implemented here, add logger and types
// https://github.com/grpc/proposal/blob/master/L5-node-client-interceptors.md
export class GrpcClientInterceptorFactory {
  static retryInterceptorFactory = (
    retryInterceptorOption: RetryInterceptorOption,
    loggerFactory: LoggerFactoryService,
  ) => {
    const {
      maxRetries = 0,
      retriedGrpcStatusCode = DEFAULT_GRPC_RETRIED_ERROR_CODE,
    } = retryInterceptorOption;

    const logger = loggerFactory.createLogger('RetryInterceptorGrpcClient');
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (options: InterceptorOptions, nextCall: Function) {
      let savedMetadata: any;
      let savedSendMessage: any;
      let savedReceiveMessage: any;
      // eslint-disable-next-line @typescript-eslint/ban-types
      let savedMessageNext: Function;
      const requester: Requester = {
        start: function (
          metadata: Metadata,
          listener: Listener,
          next: (metadata: Metadata, listener: Listener) => void,
        ) {
          savedMetadata = metadata;

          const newListener: Listener = {
            onReceiveMessage: function (
              message: any,
              next: (message: any) => void,
            ) {
              savedReceiveMessage = message;
              savedMessageNext = next;
            },
            onReceiveStatus: function (
              status,
              next: (status: StatusObject) => void,
            ) {
              let retriedCount = 0;

              const retry = function (
                message: any,
                status: StatusObject,
                metadata: Metadata,
              ) {
                retriedCount++;
                logger.debug(`retry after interal error request`, {
                  method: options?.method_definition?.path,
                  requestPayload: savedSendMessage,
                  retriedCount: retriedCount,
                  status,
                });
                const newCall = nextCall(options);
                const retryListener = {
                  onReceiveMessage: function (message: any) {
                    savedReceiveMessage = message;
                  },
                  onReceiveStatus: function (status: StatusObject) {
                    if (
                      retriedGrpcStatusCode.includes(status.code) &&
                      retriedCount < maxRetries
                    ) {
                      retry(message, status, metadata);
                    } else {
                      savedMessageNext(savedReceiveMessage);
                      next(status);
                    }
                  },
                };
                newCall.start(metadata, retryListener);
                newCall.sendMessage(message);
                newCall.halfClose();
              };

              if (
                retriedGrpcStatusCode.includes(status.code) &&
                retriedCount < maxRetries
              ) {
                retry(savedSendMessage, status, savedMetadata);
              } else {
                savedMessageNext(savedReceiveMessage);
                next(status);
              }
            },
          };

          next(metadata, newListener);
        },
        sendMessage: function (message: any, next: (message: any) => void) {
          savedSendMessage = message;
          next(message);
        },
      };
      return new InterceptingCall(nextCall(options), requester);
    };
  };
}
