
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `ServiceUnavailableError`.
 *
 * Can happen due to many reasons, including:
 *
 *  - The API usage limit was reached.
 *  - An internal error occurred on Authy that has caused the service to become
 *    unavailable.
 *    E.g. `Service unavailable`
 *  - The user has been suspended for trying multiple invalid tokens times.
 *    E.g. `User has been suspended.`
 *  - Attempting to send an SMS but failing to do at the gateway level.
 *    E.g. `SMS token was not sent.`
 *  - DoS protection due to multiple requested tokens in a short period of time.
 *  	E.g. `DoS protection. User has requested too many tokens in the last minute.`
 */

export default class ServiceUnavailableError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 503, ...rest });
  }
}
