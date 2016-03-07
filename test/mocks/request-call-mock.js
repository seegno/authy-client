
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults } from 'lodash';

/**
 * Mock a GET request to send verification token via phone call.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/key=.*?(&|$)/, 'key={key}$1').replace(/\/[0-9].*\?/, '/{authyId}?'))
    .get('/protected/json/call/{authyId}')
    .query(request.query ? defaults({ api_key: '{key}' }, request.query) : true)
    .reply(response.code, response.body);
}

/**
 * Export a request that will `succeed`.
 */

export function succeed({ request } = {}) {
  return mock({
    request,
    response: {
      body: {
        cellphone: '+351-XXX-XXX-XX67',
        message: 'Call started...',
        success: true
      },
      code: 200
    }
  });
}

/**
 * Export a request that will `succeed` with `force=true`.
 */

export function succeedWithForce() {
  return succeed({ request: { query: { force: true } } });
}

/**
 * Export a request that will `succeed` with call ignored.
 */

export function succeedWithCallIgnored() {
  return mock({
    response: {
      body: {
        cellphone: '+351-XXX-XXX-XX67',
        device: 'iphone',
        ignored: true,
        message: 'Call ignored. User is using  App Tokens and this call is not necessary. Pass force=true if you still want to call users that are using the App.',
        success: true
      },
      code: 200
    }
  });
}
