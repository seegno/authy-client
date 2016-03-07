
/**
 * Module dependencies.
 */

import InvalidRequestError from '../../src/errors/invalid-request-error';
import ValidationFailedError from '../../src/errors/validation-failed-error';

/**
 * Test `ValidationFailedError`.
 */

describe('ValidationFailedError', () => {
  it('should inherit from `InvalidRequestError`', () => {
    const error = new ValidationFailedError();

    error.should.be.instanceOf(InvalidRequestError);
  });

  it('should have default `code`', () => {
    const error = new ValidationFailedError();

    error.code.should.equal(400);
  });

  it('should have default `message`', () => {
    const error = new ValidationFailedError();

    error.message.should.equal('Validation Failed');
  });

  it('should accept `errors`', () => {
    const error = new ValidationFailedError({ errors: { foo: 'bar' } });

    error.errors.foo.should.equal('bar');
  });
});
