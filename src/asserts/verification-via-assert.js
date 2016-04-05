
/**
 * Module dependencies.
 */

import { verificationVia } from '../enums';
import { Assert, Validator, Violation } from 'validator.js';
import { isString, values } from 'lodash';

/**
 * Verification via choices.
 */

const choices = values(verificationVia);

/**
 * Export `VerificationViaAssert`.
 */

export default function verificationViaAssert() {
  // Class name.
  this.__class__ = 'VerificationVia';

  // Validation algorithm.
  this.validate = value => {
    if (!isString(value)) {
      throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
    }

    try {
      new Assert().Choice(choices).validate(value);
    } catch (e) {
      throw new Violation(this, value, e.violation);
    }

    return true;
  };

  return this;
}
