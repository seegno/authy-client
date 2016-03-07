
/**
 * Module dependencies.
 */

import { Assert } from 'validator.js';
import ValidationFailedError from '../src/errors/validation-failed-error';
import should from 'should';
import { validate } from '../src/validator';

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
        e.errors.name.should.have.length(1);
        e.errors.name[0].show().assert.should.equal('Null');
      }
    });
  });
});
