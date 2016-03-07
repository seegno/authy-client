
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import InvalidRequestError from '../../src/errors/invalid-request-error';

/**
 * Test `InvalidRequestError`.
 */

describe('InvalidRequestError', () => {
  it('should inherit from `HttpError`', () => {
    const error = new InvalidRequestError();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new InvalidRequestError();

    error.code.should.equal(400);
  });

  it('should have default `message`', () => {
    const error = new InvalidRequestError();

    error.message.should.equal('Bad Request');
  });

  it('should accept a `message`', () => {
    const error = new InvalidRequestError({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new InvalidRequestError({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
