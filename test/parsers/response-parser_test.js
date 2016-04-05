
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import parse from '../../src/parsers/response-parser';
import should from 'should';

/**
 * Test `ResponseParser`.
 */

describe('ResponseParser', () => {
  describe('parse()', () => {
    it('should throw an error if the status code is not 500', () => {
      const body = {
        errors: {
          message: 'User has been suspended.'
        },
        message: 'User has been suspended.',
        success: false
      };

      try {
        parse([{ statusCode: 503 }, body]);

        should.fail();
      } catch (e) {
        e.body.should.eql(body);
        e.code.should.equal(503);
        e.message.should.equal('User has been suspended.');
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should throw an error if status code is 200 but `success` is `false`', () => {
      const body = {
        errors: {
          message: `User doesn't exist.`
        },
        message: `User doesn't exist.`,
        success: false
      };

      try {
        parse([{ statusCode: 200 }, body]);

        should.fail();
      } catch (e) {
        e.body.should.eql(body);
        e.code.should.equal(500);
        e.message.should.equal(`User doesn't exist.`);
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should throw an error if status code is 200 but `success` is not available', () => {
      const body = {
        errors: {
          message: `User doesn't exist.`
        },
        message: `User doesn't exist.`
      };

      try {
        parse([{ statusCode: 200 }, body]);

        should.fail();
      } catch (e) {
        e.body.should.eql(body);
        e.code.should.equal(500);
        e.message.should.equal(`User doesn't exist.`);
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should throw an error if status code is 200 but `message` is not available', () => {
      const body = '<html><body><h1>502 Bad Gateway</h1> The server returned an invalid or incomplete response.</body></html>';

      try {
        parse([{ statusCode: 200 }, body]);

        should.fail();
      } catch (e) {
        e.body.should.equal(body);
        e.code.should.equal(500);
        e.message.should.equal('Internal Server Error');
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should throw an error if status code is 200 but `body` is empty', () => {
      try {
        parse([{ statusCode: 200 }]);

        should.fail();
      } catch (e) {
        should.not.exist(e.body);
        e.message.should.equal('Internal Server Error');
        e.should.be.instanceOf(HttpError);
      }
    });
  });
});
