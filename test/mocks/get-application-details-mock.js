
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults } from 'lodash';

/**
 * Mock a GET request to retrieve application details.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/key=.*?(&|$)/, 'key={key}$1'))
    .get('/protected/json/app/details')
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
        app: {
          app_id: 3,
          name: 'Test',
          plan: 'pay_as_you_go',
          sms_enabled: false
        },
        message: 'Application information.',
        success: true
      },
      code: 200
    }
  });
}
