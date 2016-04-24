
/**
 * Module dependencies.
 */

import AssertionFailedError from '../../src/errors/assertion-failed-error';
import HttpError from '../../src/errors/http-error';

/**
 * Test `AssertionFailedError`.
 */

describe('AssertionFailedError', () => {
  it('should inherit from `HttpError`', () => {
    const error = new AssertionFailedError();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new AssertionFailedError();

    error.code.should.equal(500);
  });

  it('should have default `message`', () => {
    const error = new AssertionFailedError();

    error.message.should.equal('Internal Server Error');
  });

  it('should accept a `message`', () => {
    const error = new AssertionFailedError({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new AssertionFailedError({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
