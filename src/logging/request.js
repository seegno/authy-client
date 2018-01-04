
/**
 * Module dependencies.
 */

import { obfuscate } from './request-obfuscator';
import debugnyan from 'debugnyan';
import logger from '@uphold/request-logger';
import request from 'request';

/**
 * Instances.
 */

const log = debugnyan('authy:request');

/**
 * Export `request`.
 */

export default logger(request, request => {
  obfuscate(request);

  if (request.type === 'response') {
    log.debug({ request }, `Received response for request ${request.id}`);

    return;
  }

  log.debug({ request }, `Making request ${request.id} to ${request.method} ${request.uri}`);
});
