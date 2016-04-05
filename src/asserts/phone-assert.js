
/**
 * Module dependencies.
 */

import { PhoneNumberUtil } from 'google-libphonenumber';
import debugnyan from '../logging/debugnyan';
import { isString } from 'lodash';
import { Validator, Violation } from 'validator.js';

/**
 * Instances.
 */

const log = debugnyan('authy:phone-assert');
const phoneUtil = PhoneNumberUtil.getInstance();
const expressions = {
  numeric: /\d+/,
  plusSign: /\+/
};

/**
 * Export `PhoneAssert`.
 *
 * Validate a phone number based on `libphonenumber`.
 */

export default function phoneAssert(countryOrCallingCode) {
  // Class name.
  this.__class__ = 'Phone';

  // Country code in ISO 3166-1 alpha-2 format.
  this.countryOrCallingCode = countryOrCallingCode;

  // Test if country code is numeric (e.g. `882` or `883`).
  this.isCountryCodeNumeric = expressions.numeric.test(this.countryOrCallingCode);

  // Validation algorithm.
  this.validate = value => {
    if (!isString(this.countryOrCallingCode)) {
      throw new Violation(this, value, { countryOrCallingCode: Validator.errorCode.must_be_a_string });
    }

    if (!isString(value)) {
      throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
    }

    let phone = value;
    let countryCode = this.countryOrCallingCode;
    let countriesWithSameCallingCode = [];

    try {
      if (this.isCountryCodeNumeric) {
        // Country code is numeric, which means it's actually a calling code (e.g. 351).
        // Attempt to get the main country code assigned to this calling code.
        countryCode = phoneUtil.getRegionCodeForCountryCode(this.countryOrCallingCode);

        // Test how many countries are assigned to this country calling code. If more than one,
        // it means we won't be able to validate if the number is valid for the region, since
        // we can't know for sure which region to validate.
        countriesWithSameCallingCode = phoneUtil.getRegionCodesForCountryCode(this.countryOrCallingCode);

        if (PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY === countryCode && !expressions.plusSign.test(phone)) {
          phone = `+${this.countryOrCallingCode}${phone}`;
        }
      }

      // Parse number with a default country code as fallback.
      const phoneNumber = phoneUtil.parse(phone, countryCode);

      // This validation is necessary to validate IDD formatted numbers.
      if (!phoneUtil.isValidNumber(phoneNumber)) {
        throw new Error(`Phone ${phone} is not valid`);
      }

      if (this.isCountryCodeNumeric) {
        if (countryCode === PhoneNumberUtil.UNKNOWN_REGION_) {
          log.debug({ countryCallingCode: this.countryOrCallingCode, countryCode, phone }, `Phone ${phone} is valid but country code validation skipped because region is unknown (${this.countryOrCallingCode} -> ${countryCode})`);

          return true;
        }

        if (this.countryOrCallingCode !== String(phoneNumber.getCountryCode())) {
          throw new Error(`Phone ${phone} is valid but not for country calling code ${this.countryOrCallingCode} (expected ${phoneNumber.getCountryCode()})`);
        }

        if (countriesWithSameCallingCode.length > 1) {
          log.debug({ countryCallingCode: this.countryOrCallingCode, countryCode, countryCodes: countriesWithSameCallingCode, phone }, `Phone ${phone} is valid but country code validation skipped because code ${this.countryOrCallingCode} is assigned to multiple regions`);

          return true;
        }
      }

      if (!phoneUtil.isValidNumberForRegion(phoneNumber, countryCode)) {
        throw new Error(`Phone ${phone} is valid but not for country code ${this.countryOrCallingCode} (expected ${phoneUtil.getRegionCodeForNumber(phoneNumber)})`);
      }

      log.debug(`Phone ${phone} is valid for country code ${countryCode}${this.countryOrCallingCode !== countryCode ? ` (${this.countryOrCallingCode})` : ''}`);
    } catch (e) {
      if (e.message) {
        log.debug(e.message);
      }

      throw new Violation(this, value, { reason: e && e.message || e });
    }

    return true;
  };

  return this;
}
