import { ValidationError } from '@nestjs/common';

import { HttpInvalidInputException } from '@app/core/framework/exceptions/http-exception';

import { ERROR_RESPONSE_SEPARATOR } from './exception-factory.const';

export const resolveValidationError = (errors: ValidationError[]): Error => {
  let message = 'Bad Request Exception';
  try {
    message = errors
      .map((error) => {
        const { property, constraints } = error;
        if (constraints) {
          return Object.keys(constraints)
            .map((key) => constraints[key])
            .join();
        } else if (property) {
          return `${property} invalid`;
        }
      })
      .join(ERROR_RESPONSE_SEPARATOR);
  } catch (err) {}
  return new HttpInvalidInputException(message);
};
