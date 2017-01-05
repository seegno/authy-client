
/**
 * Module dependencies.
 */

import { isString } from 'lodash';

/**
 * Instances.
 */

const replacement = /(api_key=)([^&])*/;

/**
 * Export `RequestObfuscator`.
 */

export function obfuscate(request) {
  // Obfuscate the API key on `uri`.
  request.uri = request.uri.replace(replacement, '$1*****');

  // Obfuscate the API key on `body`.
  if (isString(request.body)) {
    request.body = request.body.replace(replacement, '$1*****');
  }
}
