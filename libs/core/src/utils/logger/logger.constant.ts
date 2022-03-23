import { LoggerServiceOption } from './logger.type';

export const LOGGER_FACTORY_OPTION = 'LOGGER_FACTORY_OPTION';

export const GcloudLoggingLevel = {
  critical: 0,
  warning: 1,
  error: 2,
  info: 3,
  debug: 4,
};

export const DEFAULT_OPTIONS: LoggerServiceOption = {
  logLevel: 'info',
  useJsonFormat: true,
};
