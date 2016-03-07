
/**
 * Module dependencies.
 */

import VerificationVia from '../../src/asserts/verification-via-assert';
import should from 'should';
import { Assert as BaseAssert, Violation } from 'validator.js';
import { verificationVia } from '../../src/enums';
import { values } from 'lodash';

/**
 * Extend Assert with `VerificationVia`.
 */

const Assert = BaseAssert.extend({ VerificationVia });

/**
 * Test `VerificationViaAssert`.
 */

describe('VerificationViaAssert', () => {
  it('should throw an error if the verification via is not a string', () => {
    [[], {}, 123].forEach(via => {
      try {
        new Assert().VerificationVia().validate(via);
        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.value.should.equal('must_be_a_string');
      }
    });
  });

  it('should throw an error if the verification via is invalid', () => {
    try {
      new Assert().VerificationVia().validate('foobar');

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('VerificationVia');
      e.show().violation.choices.should.eql(values(verificationVia));
    }
  });

  it('should accept a valid verification via', () => {
    new Assert().VerificationVia().validate(verificationVia.SMS);
  });
});
