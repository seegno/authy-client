
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import UnauthorizedAccessError from '../../src/errors/unauthorized-access-error';

/**
 * Test `UnauthorizedAccessError`.
 */

describe('UnauthorizedAccessError', () => {
  it('should inherit from `HttpError`', () => {
    const error = new UnauthorizedAccessError();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new UnauthorizedAccessError();

    error.code.should.equal(401);
  });

  it('should have default `message`', () => {
    const error = new UnauthorizedAccessError();

    error.message.should.equal('Unauthorized');
  });

  it('should accept a `message`', () => {
    const error = new UnauthorizedAccessError({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new UnauthorizedAccessError({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
