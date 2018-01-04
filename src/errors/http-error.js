
/**
 * Module dependencies.
 */

import { get } from 'lodash';
import StandardError from './standard-error';

/**
 * Export `HttpError`.
 */

export default class HttpError extends StandardError {
  constructor({ code, ...rest }) {
    super(code, get(rest, 'message', get(rest, 'properties.body.message')), rest.properties);
  }
}
