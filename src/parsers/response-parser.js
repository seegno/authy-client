
/**
 * Module dependencies.
 */

import HttpError from '../errors/http-error';
import { has } from 'lodash';

/**
 * Export `parse` function to parse a response from Authy API.
 */

export default function parse([response, body]) {
  const { statusCode } = response;

  if (statusCode !== 200) {
    throw new HttpError({ code: statusCode, properties: { body } });
  }

  if (!body || !body.success || !has(body, 'success')) {
    throw new HttpError({ code: 500, properties: { body } });
  }

  return body;
}
