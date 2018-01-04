
/**
 * Module dependencies.
 */

import { PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber';
import debugnyan from 'debugnyan';

/**
 * Instances.
 */

const log = debugnyan('authy:phone-parser');
const phoneUtil = PhoneNumberUtil.getInstance();
const expressions = {
  numeric: /\d+/,
  plusSign: /\+/
};

/**
 * Export `parse` function to parse a phone and code input.
 */

export default function parse({ phone, countryOrCallingCode } = {}) {
  let countryCode;

  log.debug({ countryOrCallingCode, phone }, `Parsing phone (${countryOrCallingCode}) ${phone}`);

  // Attempt to get the country calling code (e.g. `351`) from a country code (e.g. `PT`).
  let countryCallingCode = phoneUtil.getCountryCodeForRegion(countryOrCallingCode);

  // Unless the return value is `0`, a valid country calling code (e.g. +351) was found,
  // which in turn means that `countryOrCallingCode` was a valid `countryCode`.
  if (countryCallingCode !== 0) {
    log.debug({ countryCallingCode, countryCode: countryOrCallingCode }, `Matched ${countryOrCallingCode} to ${countryCallingCode}`);

    countryCode = countryOrCallingCode;
  }

  // If `countryCode` is not yet defined, `countryOrCallingCode` is either an invalid
  // `countryCode` (e.g. `XY`) or a `countryCallingCode` instead (e.g. `351`).
  if (!countryCode) {
    countryCode = phoneUtil.getRegionCodesForCountryCode(countryOrCallingCode);
  }

  if (!countryCode.length || countryCode.length === 1 && countryCode[0] === PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY || countryCode.length > 1 && expressions.plusSign.test(phone)) {
    log.debug(`Unable to parse country or calling code ${countryOrCallingCode} so falling back to extraction from phone ${phone}`);

    if (expressions.plusSign.test(phone)) {
      try {
        const parsed = phoneUtil.parse(phone);
        const result = { countryCallingCode: parsed.getCountryCode(), phone: phoneUtil.format(parsed, PNF.E164).replace(`+${parsed.getCountryCode()}`, '') };

        log.debug(result, `Parsed phone (${countryOrCallingCode}) ${phone} as +${result.countryCallingCode}${result.phone}`);

        return result;
      } catch (e) {
        const result = { countryCallingCode: countryOrCallingCode, phone };

        log.debug(result, `Unable to parse phone (${countryOrCallingCode}) ${phone}`);

        return result;
      }
    }

    if (!expressions.numeric.test(countryOrCallingCode)) {
      const result = { countryCallingCode: countryOrCallingCode, phone };

      log.debug(result, `Unable to parse ${phone} due to unsupported country code ${countryOrCallingCode}`);

      // No country codes available for the country calling code given, so return
      // whatever we can from the original request.
      return result;
    }

    // At this point, `countryOrCallingCode` is likely a badly formatted country calling code which may have an area code included.
    // This is common for NANPA countries such as Dominican Republic where users tend to consider the area code (708) as part of the
    // country calling code (1), resulting on an unexpected 1708 country calling code.
    const parsed = phoneUtil.parse(`+${countryOrCallingCode}${phone}`);
    const result = { countryCallingCode: parsed.getCountryCode(), phone: phoneUtil.format(parsed, PNF.E164).replace(`+${parsed.getCountryCode()}`, '') };

    log.debug(result, `Parsed phone (${countryOrCallingCode}) ${phone} as +${result.countryCallingCode}${result.phone} so country calling code likely includes an area code`);

    return result;
  }

  if (Array.isArray(countryCode)) {
    if (countryCode.length === 1) {
      log.debug({ countryCode: countryCode[0] }, `Matched ${countryOrCallingCode} to ${countryCode[0]}`);
    } else {
      log.debug({ countryCodes: countryCode }, `Matched ${countryOrCallingCode} to multiple countries so choosing ${countryCode[0]}`);
    }

    // `countryOrCallingCode` is for sure a `countryCallingCode` and may have been assigned to multiple
    // countries (e.g. `44`, which is used in "GB", "GG", "IM" and "JE"). If this is observed, ignore
    // the returned list of possible country codes to avoid applying incorrect phone validation rules.
    countryCallingCode = Number(countryOrCallingCode);
    [countryCode] = countryCode;
  }

  const result = { countryCallingCode, phone: phoneUtil.format(phoneUtil.parse(phone, countryCode), PNF.E164).replace(`+${countryCallingCode}`, '') };

  log.debug({ countryCode, ...result }, `Parsed phone (${countryCallingCode}) ${phone} as (${countryCode}) +${countryCallingCode}${result.phone}`);

  return result;
}
