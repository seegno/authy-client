
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `ForbiddenError`.
 *
 * Can happen due to many reasons, including:
 *
 *   - Attempting to verify a phone using an invalid phone number.
 *     E.g. `Phone verification couldn't be created: Phone number is invalid`
 */

export default class ForbiddenError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 403, ...rest });
  }
}
