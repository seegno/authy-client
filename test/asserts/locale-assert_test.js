
/**
 * Module dependencies.
 */

import Locale from '../../src/asserts/locale-assert';
import should from 'should';
import { Assert as BaseAssert, Violation } from 'validator.js';
import { locale } from '../../src/enums';
import { values } from 'lodash';

/**
 * Extend Assert with `Locale`.
 */

const Assert = BaseAssert.extend({ Locale });

/**
 * Test `LocaleAssert`.
 */

describe('LocaleAssert', () => {
  it('should throw an error if the locale is not a string', () => {
    [[], {}, 123].forEach(locale => {
      try {
        new Assert().Locale().validate(locale);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.value.should.equal('must_be_a_string');
      }
    });
  });

  it('should throw an error if the locale is invalid', () => {
    try {
      new Assert().Locale().validate('foobar');

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('Locale');
      e.show().violation.choices.should.eql(values(locale));
    }
  });

  it('should accept a valid locale', () => {
    new Assert().Locale().validate(locale.ENGLISH);
  });
});
