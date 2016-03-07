
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults } from 'lodash';

/**
 * Mock a GET request to retrieve an user status.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/\=[^&].+/, '={key}').replace(/\/[0-9].*\//, '/{authyId}/'))
    .get('/protected/json/users/{authyId}/status', request.body)
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
        message: 'User status.',
        status: {
          authy_id: 1635,
          confirmed: true,
          country_code: 1,
          devices: ['iphone', 'ipad'],
          has_hard_token: false,
          phone_number: 'XXX-XXX-XXXX',
          registered: false
        },
        success: true
      },
      code: 200
    }
  });
}
