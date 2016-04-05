
/**
 * Module dependencies.
 */

import { activity } from '../enums';
import { Assert, Validator, Violation } from 'validator.js';
import { isString, values } from 'lodash';

/**
 * Activity choices.
 */

const choices = values(activity);

/**
 * Export `ActivityAssert`.
 */

export default function activityAssert() {
  // Class name.
  this.__class__ = 'Activity';

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
