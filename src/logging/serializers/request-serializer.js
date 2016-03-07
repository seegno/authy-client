
/**
 * Module dependencies.
 */

import { defaults, isString } from 'lodash';

/**
 * Instances.
 */

const replacement = /(api_key=)([^&])*/;

/**
 * Export `serialize`.
 */

export default function serialize(request) {
  let key = 'uri';

  if (request.body && isString(request.body)) {
    key = 'body';
  }

  return defaults({
    [key]: request[key].replace(replacement, '$1*****')
  }, request);
}
