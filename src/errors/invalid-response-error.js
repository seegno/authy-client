
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `InvalidResponseError`.
 *
 * Might be due to:
 *
 *  - Invalid response data (e.g. status 200 with errors).
 */

export default class InvalidResponseError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 400, ...rest });
  }
}
