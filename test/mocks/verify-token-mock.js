
/**
 * Module dependencies.
 */

import nock from 'nock';

/**
 * Mock a GET request to verify a token.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/verify\/.*?\//, 'verify/{token}/').replace(/\/[0-9]+/, '/{authyId}'))
    .get('/protected/json/verify/{token}/{authyId}')
    .query(request.query ? request.query : true)
    .reply(response.code, response.body);
}

/**
 * Export a request that will `fail`.
 */

export function fail({ request } = {}) {
  return mock({
    request,
    response: {
      body: {
        errors: {
          token: 'is invalid'
        },
        success: false
      },
      code: 401
    }
  });
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
