
/**
 * Module dependencies.
 */

import { isString } from 'lodash';
import { Violation, Assert as is } from 'validator.js';

/**
 * Instances.
 */

const numeric = /^\d+$/;

/**
 * Export `PhoneTokenAssert`.
 *
 * Validate an Authy Phone Validation token.
 * As far as I know there is no defined specification for this, but in my limited testing this only ever returns a four digit number.
 * Because of this we will be somewhat lenient and allow any number between 4 and 8 digits.
 */

export default function phoneTokenAssert() {
  // Class name.
  this.__class__ = 'PhoneToken';

  // Token boundaries.
  this.boundaries = {
    max: 8,
    min: 4
  };

  // Validation algorithm.
  this.validate = value => {
    // Because these codes might start with a zero we must represent them as Strings.
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
