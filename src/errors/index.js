
/**
 * Module dependencies.
 */

import ForbiddenError from './forbidden-error';
import HttpError from './http-error';
import InvalidRequestError from './invalid-request-error';
import InvalidResponseError from './invalid-response-error';
import NotFoundError from './not-found-error';
import ServiceUnavailableError from './service-unavailable-error';
import StandardError from './standard-error';
import UnauthorizedAccessError from './unauthorized-access-error';
import ValidationFailedError from './validation-failed-error';

/**
 * Export named errors.
 */

export {
  ForbiddenError,
  HttpError,
  InvalidRequestError,
  InvalidResponseError,
  NotFoundError,
  ServiceUnavailableError,
  StandardError,
  UnauthorizedAccessError,
  ValidationFailedError
};
