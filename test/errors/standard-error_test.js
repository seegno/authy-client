
/**
 * Module dependencies.
 */

import StandardError from '../../src/errors/standard-error';
import StandardHttpError from 'standard-http-error';

/**
 * Test `StandardError`.
 */

describe('StandardError', () => {
  it('should inherit from `StandardHttpError`', () => {
    const error = new StandardError(400);

    error.should.be.instanceOf(StandardHttpError);
  });
});
