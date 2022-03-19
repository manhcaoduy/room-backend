import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';

import {
  DEFAULT_OPTIONS,
  GcloudLoggingLevel,
  LOGGER_FACTORY_OPTION,
} from './logger.constant';
import { LoggerService } from './logger.service';
import { LoggerServiceOption as LoggerFactoryOption } from './logger.type';
import { plainLogFormat, severityFormat } from './logger.util';

@Injectable()
export class LoggerFactoryService {
  logger: winston.Logger;

  constructor(@Inject(LOGGER_FACTORY_OPTION) options: LoggerFactoryOption) {
    if (options.useJsonFormat === undefined) {
      options.useJsonFormat = DEFAULT_OPTIONS.useJsonFormat;
    }
    if (!options.logLevel) {
      options.logLevel = DEFAULT_OPTIONS.logLevel;
    }
    this.logger = winston.createLogger({
      levels: GcloudLoggingLevel,
      level: options.logLevel,
      format: winston.format.combine(
        winston.format.timestamp({}),
        severityFormat(),
        options.useJsonFormat ? winston.format.json() : plainLogFormat,
      ),
      transports: [new winston.transports.Console()],
    });
  }

  createLogger(caller: string): LoggerService {
    return new LoggerService(this.logger.child({ caller: caller }));
  }
}
