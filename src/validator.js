
/**
 * Module dependencies.
 */

import * as customAsserts from './asserts';
import _ from 'lodash';
import debugnyan from './logging/debugnyan';
import extraAsserts from 'validator.js-asserts';
import { Assert as BaseAssert, Constraint, Validator } from 'validator.js';
import { InvalidResponseError, ValidationFailedError } from './errors';

/**
 * Instances.
 */

const asserts = _.merge({}, extraAsserts, customAsserts);
const validator = new Validator();
const logger = debugnyan('authy:validator');

/**
 * Export `Assert`.
 */

export const Assert = BaseAssert.extend(asserts);

/**
 * Validate data using constraints.
 */

export function validate(data, constraints, { ErrorClass = ValidationFailedError } = {}) {
  const errors = validator.validate(data, new Constraint(constraints, { deepRequired: true }));

  if (errors !== true) {
    logger.warn({ errors }, 'Validation failed');

    throw new ErrorClass({ properties: { data, errors } });
  }
}

/**
 * Validate request using constraints.
 */

export function validateRequest(data, constraints) {
  return validate(data, constraints, { ErrorClass: ValidationFailedError });
}

/**
 * Validate response using constraints.
 */

export function validateResponse(data, constraints) {
  return validate(data, constraints, { ErrorClass: InvalidResponseError });
}
