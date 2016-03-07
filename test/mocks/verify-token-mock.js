
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults } from 'lodash';

/**
 * Mock a GET request to verify a token.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/key=.*?(&|$)/, 'key={key}$1').replace(/verify\/.*?\//, 'verify/{token}/').replace(/\/[0-9].*\?/, '/{authyId}?'))
    .get('/protected/json/verify/{token}/{authyId}')
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
        message: 'Token is valid.',
        success: true,
        token: 'is valid'
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
