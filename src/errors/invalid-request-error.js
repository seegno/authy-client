
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `InvalidRequestError`.
 *
 * Might be due to:
 *
 *  - Blacklisted email domain.
 *    E.g. `User was not valid` (`errors.email` will mention `is not allowed`).
 *  - Validation errors.
 */

export default class InvalidRequestError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 400, ...rest });
  }
}
