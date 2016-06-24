
/**
 * Module dependencies.
 */

import Signature from '../../src/asserts/signature-assert';
import should from 'should';
import { Assert as BaseAssert, Violation } from 'validator.js';

/**
 * Extend Assert with `Logo`.
 */

const Assert = BaseAssert.extend({ Signature });

/**
 * Test `Signature`.
 */

describe('SignatureAssert', () => {
  it('should throw an error if `key` is missing', () => {
    try {
      new Assert().Signature();

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Error);
      e.message.should.equal('Key is missing');
    }
  });

  it('should throw an error if `request` is missing', () => {
    try {
      new Assert().Signature({ key: 'foo' });

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Error);
      e.message.should.equal('Request is missing');
    }
  });

  it('should throw an error if POST request is not authentic', () => {
    // jscs:disable validateOrderInObjectKeys
    try {
      new Assert().Signature({
        key: 'foo',
        request: {
          body: {
            qux: 'net',
            foo: {
              bar: {
                biz: 'foo'
              }
            }
          },
          headers: {
            host: 'foo.bar',
            'x-authy-signature': 'uq/wB8AR1Acvn0wFcjm7mmBJyR11nuuMhMy6semsAO8=',
            'x-authy-signature-nonce': 1455825429
          },
          method: 'POST',
          protocol: 'https',
          url: '/'
        }
      }).validate('foo');

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('Signature');
    }
  });

  it('should accept a GET request', () => {
    new Assert().Signature({ key: 'foo', request: { method: 'GET' } }).validate('bar');
  });

  it('should accept a POST request', () => {
    new Assert().Signature({
      key: 'foo',
      request: {
        body: {
          qux: 'net',
          foo: {
            bar: {
              biz: 'foo'
            }
          }
        },
        headers: {
          host: 'foo.bar',
          'x-authy-signature': 'uq/wB8AR1Acvn0wFcjm7mmBJyR11nuuMhMy6semsAO8=',
          'x-authy-signature-nonce': 1455825429
        },
        method: 'POST',
        protocol: 'https',
        url: '/'
      }
    }).validate('uq/wB8AR1Acvn0wFcjm7mmBJyR11nuuMhMy6semsAO8=');
  });

  it('should encode spaces as + instead of %20', () => {
    new Assert().Signature({
      key: 'foo',
      request: {
        body: {
          qux: 'net',
          foo: {
            bar: {
              biz: 'foo bar'
            }
          }
        },
        headers: {
          host: 'foo.bar',
          'x-authy-signature': '+fyGys+d5yNJx9SpeKZdf+N77od1t1cC/fVSWDW2+kY=',
          'x-authy-signature-nonce': 1455825429
        },
        method: 'POST',
        protocol: 'https',
        url: '/'
      }
    }).validate('+fyGys+d5yNJx9SpeKZdf+N77od1t1cC/fVSWDW2+kY=');
  });
});
