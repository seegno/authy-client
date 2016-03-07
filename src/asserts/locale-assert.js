
/**
 * Module dependencies.
 */

import { Assert, Violation, Validator } from 'validator.js';
import { isString, values } from 'lodash';
import { locale } from '../enums';

/**
 * Locale choices.
 */

const choices = values(locale);

/**
 * Export `LocaleAssert`.
 */

export default function localeAssert() {
  // Class name.
  this.__class__ = 'Locale';

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
