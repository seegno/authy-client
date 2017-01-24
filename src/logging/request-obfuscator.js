
/**
 * Module dependencies.
 */

import { has } from 'lodash';

/**
 * Instances.
 */

const key = 'X-Authy-API-Key';

/**
 * Export `RequestObfuscator`.
 */

export function obfuscate(request) {
  if (!has(request, `headers.${key}`)) {
    return request;
  }

  request.headers[key] = '*****';
}
