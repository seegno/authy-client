
/**
 * Module dependencies.
 */

import { PhoneNumberUtil } from 'google-libphonenumber';
import { Violation } from 'validator.js';
import { isNumber, isString } from 'lodash';
import debugnyan from 'debugnyan';

/**
 * Instances.
 */

const log = debugnyan('authy:country-or-calling-code-assert');
const phoneUtil = PhoneNumberUtil.getInstance();
const numeric = /^\d+$/;

/**
 * Export `CountryOrCallingCodeAssert`.
 *
 * Validate a country calling code (e.g. '351', '1') based on a preset list of valid country calling codes.
 */

export default function countryOrCallingCodeAssert() {
  // Class name.
  this.__class__ = 'CountryOrCallingCode';

  // Validation algorithm.
  this.validate = value => {
    if (!isString(value) && !isNumber(value)) {
      throw new Violation(this, value, { value: 'must_be_a_string_or_number' });
    }

    if (!numeric.test(value)) {
      if (phoneUtil.getMetadataForRegion(value) === null) {
        log.debug({ countryCode: value }, `Unknown country code ${value}`);

        throw new Violation(this, value);
      }

      log.debug({ countryCode: value }, `Country code ${value} is valid`);
    } else if (PhoneNumberUtil.UNKNOWN_REGION_ === phoneUtil.getRegionCodeForCountryCode(value)) {
      log.debug({ countryCallingCode: value }, `Unknown country calling code ${value}`);

      throw new Violation(this, value);
    }

    log.debug({ countryCallingCode: value }, `Country calling code ${value} is valid`);

    return true;
  };

  return this;
}
