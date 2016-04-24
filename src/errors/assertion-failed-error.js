
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `AssertionFailedError`.
 *
 * Might be due to:
 *
 *  - Invalid response data (e.g. status 200 with errors).
 */

export default class AssertionFailedError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 500, ...rest });
  }
}
