
/**
 * Module dependencies.
 */

import { defaults } from 'lodash';
import { obfuscate } from '../../src/logging/request-obfuscator';

/**
 * Test `RequestObfuscator`.
 */

describe('RequestObfuscator', () => {
  describe('obfuscate()', () => {
    it('should ignore a request that does not include headers', () => {
      // A request object with type `response` won't have headers.
      const request = {};

      obfuscate(request).should.equal(request);
    });

    it('should strip credentials from header', () => {
      const request = {
        headers: {
          'X-Authy-API-Key': 'foobar'
        }
      };

      obfuscate(request);

      request.should.eql(defaults({ headers: { 'X-Authy-API-Key': '*****' } }, request));
    });
  });
});
