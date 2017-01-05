
/**
 * Module dependencies.
 */

import * as customAsserts from './asserts';
import debugnyan from 'debugnyan';
import extraAsserts from 'validator.js-asserts';
import { merge } from 'lodash';
import { AssertionFailedError, ValidationFailedError } from './errors';
import { Assert as BaseAssert, Constraint, Validator } from 'validator.js';

/**
 * Instances.
 */

const asserts = merge({}, extraAsserts, customAsserts);
const logger = debugnyan('authy:validator');
const validator = new Validator();

/**
 * Export `Assert`.
 */

export const Assert = BaseAssert.extend(asserts);

/**
 * Assert.
 */

export function assert(data, constraints) {
  const errors = validator.validate(data, new Constraint(constraints, { deepRequired: true }));

  if (errors !== true) {
    logger.error({ errors }, 'Assertion failed');

    throw new AssertionFailedError({ properties: { data, errors } });
  }
}

/**
 * Validate.
 */

export function validate(data, constraints) {
  const errors = validator.validate(data, new Constraint(constraints, { deepRequired: true }));

  if (errors !== true) {
    logger.warn({ errors }, 'Validation failed');

    throw new ValidationFailedError({ properties: { data, errors } });
  }
}
