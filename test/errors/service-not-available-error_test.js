
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import ServiceUnvailable from '../../src/errors/service-unavailable-error';

/**
 * Test `ServiceUnvailable`.
 */

describe('ServiceUnvailable', () => {
  it('should inherit from `HttpError`', () => {
    const error = new ServiceUnvailable();

    error.should.be.instanceOf(HttpError);
  });

  it('should have default `code`', () => {
    const error = new ServiceUnvailable();

    error.code.should.equal(503);
  });

  it('should have default `message`', () => {
    const error = new ServiceUnvailable();

    error.message.should.equal('Service Unavailable');
  });

  it('should accept a `message`', () => {
    const error = new ServiceUnvailable({ message: 'foo' });

    error.message.should.equal('foo');
  });

  it('should accept `properties`', () => {
    const error = new ServiceUnvailable({ properties: { foo: 'bar' } });

    error.foo.should.equal('bar');
  });
});
