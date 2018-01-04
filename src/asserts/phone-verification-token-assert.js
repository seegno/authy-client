
/**
 * Module dependencies.
 */

import { Violation, Assert as is } from 'validator.js';
import { isString } from 'lodash';

/**
 * Instances.
 */

const numeric = /^\d+$/;

/**
 * Export `PhoneVerificationTokenAssert`.
 *
 * Validate an phone verification token.
 */

export default function phoneVerificationTokenAssert() {
  // Class name.
  this.__class__ = 'PhoneVerificationToken';

  // Token boundaries.
  this.boundaries = {
    max: 8,
    min: 4
  };

  // Validation algorithm.
  this.validate = value => {
    if (!isString(value)) {
      throw new Violation(this, value, { value: 'must_be_a_string' });
    }

    if (!numeric.test(value)) {
      throw new Violation(this, value, { value: 'must_be_numeric' });
    }

    try {
      is.ofLength(this.boundaries).validate(value);
    } catch (e) {
      throw new Violation(this, value, e.violation);
    }

    return true;
  };

  return this;
}
