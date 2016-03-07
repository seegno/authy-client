
/**
 * Module dependencies.
 */

import _ from 'lodash';
import * as customAsserts from './asserts';
import debugnyan from './logging/debugnyan';
import extraAsserts from 'validator.js-asserts';
import { Assert as BaseAssert, Constraint, Validator } from 'validator.js';
import { InvalidResponseError, ValidationFailedError} from './errors';

/**
 * Instances.
 */

const asserts = _.merge({}, extraAsserts, customAsserts);
const validator = new Validator();
const logger = debugnyan('authy:validator');

/**
 * Validate data using constraints.
 */

export function validate(data, constraints) {
  const errors = validator.validate(data, new Constraint(constraints, { deepRequired: true }));

  if (errors !== true) {
    logger.warn({ errors }, 'Validation failed');

    throw new ValidationFailedError({ errors });
  }
}

/**
 * Validate response using constraints.
 */

export function validateResponse(body, constraints) {
  const errors = validator.validate(body, new Constraint(constraints, { deepRequired: true }));

  if (errors !== true) {
    logger.warn({ errors }, 'Response validation failed');

    throw new InvalidResponseError({ properties: { body, errors } });
  }
}

/**
 * Export `Assert`.
 */

export const Assert = BaseAssert.extend(asserts);
