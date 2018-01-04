
/**
 * Module dependencies.
 */

import { Assert as BaseAssert, Violation } from 'validator.js';
import CountryOrCallingCode from '../../src/asserts/country-or-calling-code-assert';
import should from 'should';

/**
 * Extend Assert with `CountryOrCallingCode`.
 */

const Assert = BaseAssert.extend({ CountryOrCallingCode });

/**
 * Test `CountryOrCallingCodeAssert`.
 */

describe('CountryOrCallingCodeAssert', () => {
  it('should throw an error if the country calling code is not a string or a number', () => {
    [[], {}].forEach(choice => {
      try {
        new Assert().CountryOrCallingCode().validate(choice);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.value.should.equal('must_be_a_string_or_number');
      }
    });
  });

  it('should throw an error if the country calling code is invalid', () => {
    ['80', '999'].forEach(code => {
      try {
        new Assert().CountryOrCallingCode().validate(code);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.show().assert.should.equal('CountryOrCallingCode');
      }
    });
  });

  it('should throw an error if the country code is invalid', () => {
    ['XY'].forEach(code => {
      try {
        new Assert().CountryOrCallingCode().validate(code);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.show().assert.should.equal('CountryOrCallingCode');
      }
    });
  });

  it('should accept a valid country calling code', () => {
    ['1', '351'].forEach(code => {
      try {
        new Assert().CountryOrCallingCode().validate(code);
      } catch (e) {
        throw e;
      }
    });
  });

  it('should accept a valid country code', () => {
    ['PT', 'US'].forEach(code => {
      try {
        new Assert().CountryOrCallingCode().validate(code);
      } catch (e) {
        throw e;
      }
    });
  });
});
