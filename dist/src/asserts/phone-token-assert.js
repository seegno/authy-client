'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = phoneTokenAssert;

var _lodash = require('lodash');

var _validator = require('validator.js');

/**
 * Instances.
 */

/**
 * Module dependencies.
 */

const numeric = /^\d+$/;

/**
 * Export `PhoneTokenAssert`.
 *
 * Validate an Authy Phone Validation token.
 * As far as I know there is no defined specification for this, but in my limited testing this only ever returns a four digit number.
 * Because of this we will be somewhat lenient and allow any number between 4 and 8 digits.
 */

function phoneTokenAssert() {
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
    if (!(0, _lodash.isString)(value)) {
      throw new _validator.Violation(this, value, { value: 'must_be_a_string' });
    }

    if (!numeric.test(value)) {
      throw new _validator.Violation(this, value, { value: 'must_be_numeric' });
    }

    try {
      _validator.Assert.ofLength(this.boundaries).validate(value);
    } catch (e) {
      throw new _validator.Violation(this, value, e.violation);
    }

    return true;
  };

  return this;
}