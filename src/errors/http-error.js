
/**
 * Module dependencies.
 */

import StandardError from './standard-error';
import { get } from 'lodash';

/**
 * Export `HttpError`.
 */

export default class HttpError extends StandardError {
  constructor({ code, ...rest }) {
    super(code, get(rest, 'message', get(rest, 'properties.body.message')), rest.properties);
  }
}
