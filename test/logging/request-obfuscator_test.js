
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
    it('should strip credentials from query string', () => {
      const request = {
        id: '354f8341-eb27-4c91-a8f7-a30e303a0976',
        method: 'GET',
        uri: 'foo=bar&api_key=foobar'
      };

      obfuscate(request);

      request.should.eql(defaults({ uri: 'foo=bar&api_key=*****' }, request));
    });

    it('should strip credentials from request `body`', () => {
      const request = {
        body: 'foo=bar&api_key=foobar',
        id: '354f8341-eb27-4c91-a8f7-a30e303a0976',
        method: 'GET',
        uri: 'foo=bar&api_key=foobar'
      };

      obfuscate(request);

      request.should.eql(defaults({ body: 'foo=bar&api_key=*****' }, request));
    });
  });
});
