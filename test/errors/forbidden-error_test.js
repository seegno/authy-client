
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import ForbiddenError from '../../src/errors/forbidden-error';

/**
 * Test `ForbiddenError`.
 */

describe('ForbiddenError', () => {
  it('should inherit from `HttpError`', () => {
    const error = new ForbiddenError();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new ForbiddenError();

    error.code.should.equal(403);
  });

  it('should have default `message`', () => {
    const error = new ForbiddenError();

    error.message.should.equal('Forbidden');
  });

  it('should accept a `message`', () => {
    const error = new ForbiddenError({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new ForbiddenError({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
