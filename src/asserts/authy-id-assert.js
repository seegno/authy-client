
/**
 * Module dependencies.
 */

import { Violation } from 'validator.js';
import { isNumber, isString } from 'lodash';

/**
 * Instances.
 */

const numeric = /^\d+$/;

/**
 * Export `AuthyIdAssert`.
 */

export default function authyIdAssert() {
  // Class name.
  this.__class__ = 'AuthyId';

  // Validation algorithm.
  this.validate = value => {
    if (!isString(value) && !isNumber(value)) {
      throw new Violation(this, value, { value: 'must_be_a_string_or_number' });
    }

    if (!numeric.test(value)) {
      throw new Violation(this, value, { value: 'must_be_numeric' });
    }

    return true;
  };

  return this;
}
