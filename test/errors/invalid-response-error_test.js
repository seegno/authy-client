
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import InvalidResponseError from '../../src/errors/invalid-response-error';

/**
 * Test `InvalidResponseError`.
 */

describe('InvalidResponseError', () => {
  it('should inherit from `HttpError`', () => {
    const error = new InvalidResponseError();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new InvalidResponseError();

    error.code.should.equal(500);
  });

  it('should have default `message`', () => {
    const error = new InvalidResponseError();

    error.message.should.equal('Internal Server Error');
  });

  it('should accept a `message`', () => {
    const error = new InvalidResponseError({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new InvalidResponseError({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
