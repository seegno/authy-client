
/**
 * Module dependencies.
 */

import HttpError from '../errors/http-error';
import InvalidRequestError from '../errors/invalid-request-error';
import ServiceUnavailableError from '../errors/service-unavailable-error';
import UnauthorizedAccessError from '../errors/unauthorized-access-error';
import NotFoundError from '../errors/not-found-error';
import debugnyan from '../logging/debugnyan';
import { has } from 'lodash';

/**
 * Instances.
 */

const logger = debugnyan('authy:response-parser');

/**
 * Export `parse` function to parse a response from Authy API.
 */

export default function parse([response, body]) {
  const { request: { _debugId: id }, statusCode } = response;

  logger.debug(`Parsing response${id !== undefined ? ` for request #${id}` : '' }`);

  if (statusCode === 503) {
    throw new ServiceUnavailableError({ properties: { body } });
  }

  if (statusCode === 404) {
    throw new NotFoundError({ properties: { body } });
  }

  if (statusCode === 401) {
    throw new UnauthorizedAccessError({ properties: { body } });
  }

  if (statusCode === 400) {
    throw new InvalidRequestError({ properties: { body } });
  }

  if (statusCode !== 200) {
    throw new HttpError({ code: statusCode, message: `Unexpected status code ${statusCode}`, properties: { body } });
  }

  // Fallback error just in case the HTTP error is a 200 but the response was not successful.
  // E.g. 200 with body mentioning a `502 Bad Gateway` or 200 with `User doesn't exist.`.
  if (!body || !body.success || !has(body, 'success')) {
    throw new HttpError({ code: statusCode, message: 'Unexpected error occurred', properties: { body } });
  }

  return body;
}
