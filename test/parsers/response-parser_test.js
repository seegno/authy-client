
/**
 * Module dependencies.
 */

import HttpError from '../../src/errors/http-error';
import InvalidRequestError from '../../src/errors/invalid-request-error';
import NotFoundError from '../../src/errors/not-found-error';
import ServiceUnavailableError from '../../src/errors/service-unavailable-error';
import UnauthorizedAccessError from '../../src/errors/unauthorized-access-error';
import parse from '../../src/parsers/response-parser';
import should from 'should';

/**
 * Test `ResponseParser`.
 */

describe('ResponseParser', () => {
  describe('parse()', () => {
    const id = 0;

    describe('status code 503', () => {
      const statusCode = 503;

      it('should throw an `ServiceUnavailableError`', () => {
        const body = {
          errors: {
            message: 'User has been suspended.'
          },
          message: 'User has been suspended.',
          success: false
        };

        try {
          parse([{ request: { _debugId: id }, statusCode }, body]);

          should.fail();
        } catch (e) {
          e.body.should.eql(body);
          e.message.should.equal(body.message);
          e.should.be.instanceOf(ServiceUnavailableError);
        }
      });
    });

    describe('status code 404', () => {
      const statusCode = 404;

      it('should throw an `NotFoundError`', () => {
        const body = {
          errors: {
            message: 'User not found.'
          },
          message: 'User not found.',
          success: false
        };

        try {
          parse([{ request: { _debugId: id }, statusCode }, body]);

          should.fail();
        } catch (e) {
          e.body.should.eql(body);
          e.message.should.equal(body.message);
          e.should.be.instanceOf(NotFoundError);
        }
      });
    });

    describe('status code 401', () => {
      const statusCode = 401;

      it('should throw an `UnauthorizedAccessError`', () => {
        const body = {
          errors: {
            message: 'Token is invalid.'
          },
          message: 'Token is invalid.',
          success: false,
          token: 'is invalid'
        };

        try {
          parse([{ request: { _debugId: id }, statusCode }, body]);

          should.fail();
        } catch (e) {
          e.body.should.eql(body);
          e.message.should.equal(body.message);
          e.should.be.instanceOf(UnauthorizedAccessError);
        }
      });
    });

    describe('status code 400', () => {
      const statusCode = 400;

      it('should throw an `InvalidRequestError`', () => {
        const body = {
          email: `is invalid and can't be blank`,
          errors: {
            email: `is invalid and can\'t be blank`,
            message: 'User was not valid.'
          },
          message: 'User was not valid.',
          success: false
        };

        try {
          parse([{ request: { _debugId: id }, statusCode }, body]);

          should.fail();
        } catch (e) {
          e.body.should.eql(body);
          e.message.should.equal(body.message);
          e.should.be.instanceOf(InvalidRequestError);
        }
      });
    });

    it('should fallback to an `HttpError` if success message is `false`', () => {
      const body = {
        errors: {
          message: `User doesn't exist.`
        },
        message: `User doesn't exist.`,
        success: false
      };
      const statusCode = 200;

      try {
        parse([{ request: { _debugId: id }, statusCode }, body]);

        should.fail();
      } catch (e) {
        e.body.should.equal(body);
        e.message.should.equal('Unexpected error occurred');
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should fallback to an `HttpError` if no specific error is thrown', () => {
      const body = '<html><body><h1>502 Bad Gateway</h1> The server returned an invalid or incomplete response.</body></html>';
      const statusCode = 200;

      try {
        parse([{ request: { _debugId: id }, statusCode }, body]);

        should.fail();
      } catch (e) {
        e.body.should.equal(body);
        e.message.should.equal('Unexpected error occurred');
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should fallback to an `HttpError` if no specific body is returned', () => {
      const statusCode = 200;

      try {
        parse([{ request: { _debugId: id }, statusCode }]);

        should.fail();
      } catch (e) {
        should.not.exist(e.body);
        e.message.should.equal('Unexpected error occurred');
        e.should.be.instanceOf(HttpError);
      }
    });

    it('should fallback to an `HttpError` if status code is unexpected', () => {
      // Non-existent response to date.
      const body = {
        errors: {
          limit: 'Rate limit exceeded'
        }
      };
      const statusCode = 429;

      try {
        parse([{ request: { _debugId: id }, statusCode }, body]);

        should.fail();
      } catch (e) {
        e.body.should.eql(body);
        e.message.should.equal('Unexpected status code 429');
        e.should.be.instanceOf(HttpError);
      }
    });
  });
});
