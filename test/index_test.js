
/**
 * Module dependencies.
 */

import * as enums from '../src/enums';
import * as errors from '../src/errors';
import * as index from '../src/';
import Client from '../src/client';

/**
 * Test `index`.
 */

describe('Index', () => {
  describe('exports', () => {
    it('should export `Client` constructor', () => {
      index.Client.should.equal(Client);
    });

    it('should export `enums`', () => {
      index.enums.should.eql(enums);
    });

    it('should export `errors`', () => {
      index.errors.should.eql(errors);
    });
  });
});
