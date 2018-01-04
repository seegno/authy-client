
/**
 * Module dependencies.
 */

import { Assert as BaseAssert, Violation } from 'validator.js';
import AuthyId from '../../src/asserts/authy-id-assert';
import should from 'should';

/**
 * Extend Assert with `AuthyId`.
 */

const Assert = BaseAssert.extend({ AuthyId });

/**
 * Test `AuthyIdAssert`.
 */

describe('AuthyIdAssert', () => {
  it('should throw an error if authy id is not a string nor a number', () => {
    [{}, []].forEach(authyId => {
      try {
        new Assert().AuthyId().validate(authyId);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.show().violation.value.should.equal('must_be_a_string_or_number');
      }
    });
  });

  it('should throw an error if authy id is not numeric', () => {
    ['', 'foobar', '.123457', 'X1234567'].forEach(authyId => {
      try {
        new Assert().AuthyId().validate(authyId);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.show().violation.value.should.equal('must_be_numeric');
      }
    });
  });

  it('should accept a valid authy id', () => {
    [1234567, '0123456'].forEach(authyId => {
      new Assert().AuthyId().validate(authyId);
    });
  });
});
