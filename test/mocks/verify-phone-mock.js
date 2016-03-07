
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults } from 'lodash';

/**
 * Mock a GET request to verify a phone.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => {
      path = path.replace(/key=.*?(&|$)/, 'key={key}$1');

      if (!(request.query && request.query.verification_code)) {
        return path.replace(/verification_code=.*?(&|$)/, 'verification_code={token}$1');
      }

      return path;
    })
    .get('/protected/json/phones/verification/check')
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
        message: 'Verification code is correct.',
        success: true
      },
      code: 200
    }
  });
}
