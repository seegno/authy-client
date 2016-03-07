
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `UnauthorizedAccessError`.
 *
 * Can happen due to many reasons, including:
 *
 *   - Incorrect URL endpoint.
 *     E.g. `Requested URL was not found. Please check http://docs.authy.com/ to see the valid URLs`
 *   - Invalid token supplied.
 *      E.g. `Token is invalid.`
 *   - Incorrect or invalid API key.
 *     E.g. `Invalid API key.`
 *   - A user with the given id was not found.
 *     E.g. `User doesn't exist.`
 */

export default class UnauthorizedAccessError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 401, ...rest });
  }
}
