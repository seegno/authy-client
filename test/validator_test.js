
/**
 * Module dependencies.
 */

import { Assert } from 'validator.js';
import should from 'should';
import { InvalidResponseError, ValidationFailedError } from '../src/errors';
import { validate, validateRequest, validateResponse } from '../src/validator';

/**
 * Test `Validator`.
 */

describe('Validator', () => {
  describe('validate()', () => {
    it('should throw an error if validation fails', () => {
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

    it('should a custom error class', () => {
      function CustomError() {}

      try {
        validate({ name: 'Foo' }, { name: new Assert().Null() }, { ErrorClass: CustomError });

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(CustomError);
      }
    });
  });

  describe('validateRequest()', () => {
    it('should throw a `ValidationFailedError` if validation fails', () => {
      try {
        validateRequest({ name: 'Foo' }, { name: new Assert().Null() });

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(ValidationFailedError);
        e.data.should.eql({ name: 'Foo' });
        e.errors.name.should.have.length(1);
        e.errors.name[0].show().assert.should.equal('Null');
      }
    });
  });

  describe('validateResponse()', () => {
    it('should throw a `InvalidResponseError` if validation fails', () => {
      try {
        validateResponse({ name: 'Foo' }, { name: new Assert().Null() });

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(InvalidResponseError);
        e.data.should.eql({ name: 'Foo' });
        e.errors.name.should.have.length(1);
        e.errors.name[0].show().assert.should.equal('Null');
      }
    });
  });
});
