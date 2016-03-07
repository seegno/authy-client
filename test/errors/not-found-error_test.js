
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import NotFoundError from '../../src/errors/not-found-error';

/**
 * Test `NotFoundError`.
 */

describe('NotFoundError', () => {
  it('should inherit from `HttpError`', () => {
    const error = new NotFoundError();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new NotFoundError();

    error.code.should.equal(404);
  });

  it('should have default `message`', () => {
    const error = new NotFoundError();

    error.message.should.equal('Not Found');
  });

  it('should accept a `message`', () => {
    const error = new NotFoundError({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new NotFoundError({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
