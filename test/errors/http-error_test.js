
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import StandardError from '../../src/errors/standard-error';

/**
 * Test `HttpError`.
 */

describe('HttpError', () => {
  it('should inherit from `StandardError`', () => {
    const error = new HttpError({ code: 400 });

    error.should.be.instanceOf(StandardError);
  });

  it('should have a default message according to status code', () => {
    const error = new HttpError({ code: 400 });

    error.message.should.equal('Bad Request');
  });

  it('should accept a `message`', () => {
    const error = new HttpError({ code: 400, message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new HttpError({ code: 400, properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });

  it('should use a message from `properties.body.message` if `message` is not available', () => {
    const error = new HttpError({ code: 400, properties: { body: { message: 'bar' } } });

    error.message.should.equal('bar');
  });

  it('should use `message` if available', () => {
    const error = new HttpError({ code: 400, message: 'foo', properties: { body: { message: 'bar' } } });

    error.message.should.equal('foo');
  });
});
