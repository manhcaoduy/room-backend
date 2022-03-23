import { parseBooleanConfig } from '@app/core/utils/config';

export default () => ({
  app: {
    httpPort: parseInt(process.env.HTTP_PORT, 10) || 5000,
  },
  logger: {
    level: process.env.LOG_LEVEL,
    useJsonFormat: parseBooleanConfig(process.env.LOG_USE_JSON),
  },
  httpInterceptor: {
    logResponse: parseBooleanConfig(process.env.HTTP_INTERCEPTOR_LOG_RESPONSE),
  },
});
