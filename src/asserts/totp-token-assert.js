
/**
 * Module dependencies.
 */

import { Assert, Violation } from 'validator.js';
import { isNumber, isString } from 'lodash';

/**
 * Instances.
 */

const numeric = /^\d+$/;

/**
 * Export `TotpTokenAssert`.
 *
 * Validate a TOTP token based on http://tools.ietf.org/html/rfc6238.
 */

export default function totpTokenAssert() {
  // Class name.
  this.__class__ = 'TotpToken';

  // Token boundaries.
  this.boundaries = {
    max: 8,
    min: 6
  };

  // Validation algorithm.
  this.validate = value => {
    if (!isString(value) && !isNumber(value)) {
      throw new Violation(this, value, { value: 'must_be_a_string_or_number' });
    }

    if (!numeric.test(value)) {
      throw new Violation(this, value, { value: 'must_be_numeric' });
    }

    try {
      new Assert().Length(this.boundaries).validate(value);
    } catch (e) {
      throw new Violation(this, value, e.violation);
    }

    return true;
  };

  return this;
}
