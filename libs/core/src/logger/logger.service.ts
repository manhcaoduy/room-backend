import * as winston from 'winston';

export class MoshLoggerService {
  private logger: any;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  resolveMetadata(...optionalParams: any[]): object {
    if (!optionalParams.length) {
      return {};
    }
    const objectParams = optionalParams.filter(
      (param) => param instanceof Object && !(param instanceof Error),
    );
    const err = optionalParams.find((param) => param instanceof Error);
    const error = err ? { ...err, stack: err?.stack || undefined } : undefined;
    return Object.assign({}, ...objectParams, { error });
  }

  /**
   * Write a 'critical' level log.
   */
  critical(message: any, ...optionalParams: any[]) {
    this.logger.critical(message, this.resolveMetadata(...optionalParams));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warning(message, this.resolveMetadata(...optionalParams));
  }

  /**
   * Write a 'info' level log.
   */
  info(message: any, ...optionalParams: any[]) {
    this.logger.info(message, this.resolveMetadata(...optionalParams));
  }

  report(eventName: string, ...optionalParams: any[]) {
    const data = this.resolveMetadata(...optionalParams);
    data['logging.googleapis.com/labels'] = { eventName };
    this.logger.info('', data);
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, this.resolveMetadata(...optionalParams));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, this.resolveMetadata(...optionalParams));
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, this.resolveMetadata(...optionalParams));
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, this.resolveMetadata(...optionalParams));
  }
}
