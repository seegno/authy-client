
/**
 * Module dependencies.
 */

import { Assert as BaseAssert, Violation } from 'validator.js';
import { PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber';
import Phone from '../../src/asserts/phone-assert';
import should from 'should';

/**
 * Extend Assert with `PhoneAssert`.
 */

const Assert = BaseAssert.extend({ Phone });
const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Test `PhoneAssert`.
 */

describe('PhoneAssert', () => {
  it('should throw an error if a country or a country calling code is missing', () => {
    try {
      new Assert().Phone().validate('foo1');

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.violation.countryOrCallingCode.should.equal('must_be_a_string');
    }
  });

  it('should throw an error if the phone number is not a string', () => {
    [[], {}, 123].forEach(choice => {
      try {
        new Assert().Phone('PT').validate(choice);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.value.should.equal('must_be_a_string');
      }
    });
  });

  it('should throw an error if the phone number is invalid', () => {
    [{
      countryCode: 'MX',
      phone: '+3511234567'
    }, {
      countryCode: 'IT',
      phone: '541-754-3010'
    }, {
      countryCode: 'GB',
      phone: '(809) 234 5678'
    }].forEach(({ countryCode, phone }) => {
      try {
        new Assert().Phone(countryCode).validate(phone);

        should.fail(phone);
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.reason.should.match(/is not valid/);
      }
    });
  });

  it('should throw an error if the input is invalid for the country of origin', () => {
    [{
      countryOrCallingCode: 'AU',
      expectedCountryCode: 'US',
      phone: `0011 1 ${phoneUtil.format(phoneUtil.getExampleNumber('US'), PNF.NATIONAL)}`
    }, {
      countryOrCallingCode: 'PT',
      expectedCountryCode: 'MX',
      phone: phoneUtil.format(phoneUtil.getExampleNumber('MX'), PNF.E164)
    }, {
      countryOrCallingCode: 'ES',
      expectedCountryCode: 'IT',
      phone: phoneUtil.format(phoneUtil.getExampleNumber('IT'), PNF.E164).replace('+', '00')
    }, {
      countryOrCallingCode: 'CH',
      expectedCountryCode: 'US',
      phone: `00 1 ${phoneUtil.format(phoneUtil.getExampleNumber('US'), PNF.NATIONAL)}`
    }, {
      countryOrCallingCode: 'PT',
      expectedCountryCode: 'DO',
      phone: phoneUtil.format(phoneUtil.getExampleNumber('DO'), PNF.E164)
    }, {
      countryOrCallingCode: 'GB',
      expectedCountryCode: 'IM',
      phone: phoneUtil.format(phoneUtil.getExampleNumber('IM'), PNF.NATIONAL)
    }, {
      countryOrCallingCode: '1',
      expectedCountryCode: '351',
      phone: phoneUtil.format(phoneUtil.getExampleNumber('PT'), PNF.E164)
    }, {
      countryOrCallingCode: '39',
      expectedCountryCode: '41',
      phone: phoneUtil.format(phoneUtil.getExampleNumber('CH'), PNF.E164)
    }, {
      countryOrCallingCode: '41',
      expectedCountryCode: '1',
      phone: `00 1 ${phoneUtil.format(phoneUtil.getExampleNumber('US'), PNF.NATIONAL)}`
    }].forEach(({ countryOrCallingCode, phone, expectedCountryCode }) => {
      try {
        new Assert().Phone(countryOrCallingCode).validate(phone);

        should.fail(`${countryOrCallingCode} ${phone} ${expectedCountryCode}`);
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.reason.should.match(/\b(is valid but not for country)|(is not valid)\b/);
      }
    });
  });

  it('should accept an phone number that is valid for the country of origin', () => {
    [{
      countryOrCallingCode: 'MX',
      phone: '+5215555123123'
    },
    {
      countryOrCallingCode: 'PT',
      phone: '+351923456789'
    },
    {
      countryOrCallingCode: 'PT',
      phone: '963456789'
    },
    {
      countryOrCallingCode: 'US',
      phone: '1-541-754-3010'
    },
    {
      countryOrCallingCode: 'IT',
      phone: '00 39 312 123 1234'
    },
    {
      countryOrCallingCode: 'IT',
      phone: '+39 0187 1234(12)'
    },
    {
      countryOrCallingCode: 'DO',
      phone: '(809) 234 5678'
    },
    {
      countryOrCallingCode: 'DO',
      phone: '1 809 555 5555'
    },
    {
      countryOrCallingCode: '351',
      phone: '+351 912 345 679'
    },
    {
      countryOrCallingCode: '351',
      phone: '912 345 679'
    },
    {
      countryOrCallingCode: '1',
      phone: '829 590 5555'
    },
    {
      countryOrCallingCode: '1',
      phone: '011 1 408-550-3542'
    },
    {
      countryOrCallingCode: '1',
      phone: '+1 809 234 5678'
    },
    {
      countryOrCallingCode: '1809',
      phone: '+1 809 234 5678'
    },
    {
      countryOrCallingCode: '882',
      phone: '13300655'
    },
    {
      countryOrCallingCode: '882',
      phone: '+88213300655'
    }].forEach(({ countryOrCallingCode, phone }) => {
      try {
        new Assert().Phone(countryOrCallingCode).validate(phone);
      } catch (e) {
        throw e;
      }
    });
  });
});
