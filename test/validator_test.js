
/**
 * Module dependencies.
 */

import { Assert } from 'validator.js';
import { AssertionFailedError, ValidationFailedError } from '../src/errors';
import { assert, validate } from '../src/validator';
import should from 'should';

/**
 * Test `Validator`.
 */

describe('Validator', () => {
  describe('assert()', () => {
    it('should throw a `AssertionFailedError` if assertion fails', () => {
      try {
        assert({ name: 'Foo' }, { name: new Assert().Null() });

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(AssertionFailedError);
        e.data.should.eql({ name: 'Foo' });
        e.errors.name.should.have.length(1);
        e.errors.name[0].show().assert.should.equal('Null');
      }
    });
  });
  describe('validate()', () => {
    it('should throw a `ValidationFailedError` if validation fails', () => {
      try {
        validate({ name: 'Foo' }, { name: new Assert().Null() });

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(ValidationFailedError);
        e.data.should.eql({ name: 'Foo' });
        e.errors.name.should.have.length(1);
        e.errors.name[0].show().assert.should.equal('Null');
      }
    });
  });
});
