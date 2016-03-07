
/**
 * Module dependencies.
 */

import serialize from '../../../src/logging/serializers/request-serializer';

/**
 * Test `RequestSerializer`.
 */

describe('RequestSerializer', () => {
  describe('serialize()', () => {
    it('should strip credentials from query string', () => {
      serialize({ uri: 'foo.bar?api_key=qux' }).should.eql({ uri: 'foo.bar?api_key=*****' });
    });

    it('should strip credentials from url-encoded body', () => {
      serialize({ body: 'foo=bar&api_key=qux' }).should.eql({ body: 'foo=bar&api_key=*****' });
    });
  });
});
