
/**
 * Module dependencies.
 */

import HttpError from './http-error';

/**
 * Export `NotFoundError`.
 *
 * Might be due to:
 *
 *  - Approval request not found.
 *  	E.g. `Approval request not found: 4b7c4230-a9bb-0133-7bff-0e67b818e6fb`
 *  - User not found when requesting a token via sms or call.
 *  	E.g. `User not found.`
 *  - Approval request not found.
 *  	E.g. `No pending verifications for +351 91-234-5678 found.`
 */

export default class NotFoundError extends HttpError {
  constructor({ ...rest }) {
    super({ code: 404, ...rest });
  }
}
