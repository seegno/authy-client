
/**
 * Module dependencies.
 */

import InvalidRequestError from './invalid-request-error';

/**
 * `ValidationFailedError`.
 */

export default class ValidationFailedError extends InvalidRequestError {
  constructor(properties) {
    super({ code: 400, message: 'Validation Failed', properties });
  }
}
