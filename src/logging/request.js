
/**
 * Module dependencies.
 */

import debug from 'request-debug';
import debugnyan from './debugnyan';
import request from 'request';

/**
 * Instances.
 */

const log = debugnyan('authy:request');
const replacement = /(api_key=)([^&])*/;

/**
 * Customize log handler.
 */

debug(request, (type, data) => {
  const uri = (data.uri || '').replace(replacement, '$1*****');

  let message = `Making request #${data.debugId} to ${data.method} ${uri}`;

  if (type === 'response') {
    message = `Received response for request #${data.debugId}`;
  }

  log.debug({ [type]: data, type }, message);
});
