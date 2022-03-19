import stringify from 'safe-stable-stringify';
import * as winston from 'winston';

import { GcloudLoggingLevel } from './logger.constant';

export const plainLogFormat = winston.format.printf((info) => {
  const data = Object.assign({}, info, {
    level: undefined,
    message: undefined,
    timestamp: undefined,
    severity: undefined,
    caller: undefined,
    env: undefined,
  });

  let errorStack = '';

  if (data?.error && data?.error?.stack) {
    errorStack = `\n${data?.error?.stack}`;
    data.error.stack = undefined;
  }

  const stringifiedRest = stringify(data);
  if (stringifiedRest !== '{}') {
    return `${info.timestamp}   ${info.severity}: ${info.message} ${stringifiedRest}${errorStack}`;
  }

  const caller = info.caller ? `  ${info.caller}` : '';
  return `${info.timestamp}   ${info.severity}${caller}: ${info.message}${errorStack}`;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const severityFormat = winston.format((info, opts = {}) => {
  if (!info.level) {
    info.severity = GcloudLoggingLevel.info;
  } else {
    info.severity = info.level.toUpperCase();
    info.level = undefined;
  }
  if (!info.message) {
    info.message = undefined;
  }
  return info;
});
