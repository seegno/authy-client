
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * `ValidationFailedError`.
 */

export default class ValidationFailedError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 400, message: 'Validation Failed', ...rest });
  }
}
