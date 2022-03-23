import { HttpLoggingAsyncOptions } from './http-logging.type';

export const HTTP_LOGGING_STATIC_OPTIONS = 'http_logging_static_options';
export const HTTP_LOGGING_ASYNC_OPTIONS = 'http_logging_async_options';

export const DEFAULT_OPTIONS: HttpLoggingAsyncOptions = {
  logResponse: false,
};
