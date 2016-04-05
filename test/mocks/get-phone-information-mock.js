
/**
 * Module dependencies.
 */

import { defaults } from 'lodash';
import nock from 'nock';

/**
 * Mock a GET request to retrieve information about a phone.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/key=.*?(&|$)/, 'key={key}$1'))
    .get('/protected/json/phones/info')
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
        message: 'Phone number information as of 2016-02-20 18:09:18 UTC',
        ported: false,
        provider: 'Pinger/TextFree',
        success: true,
        type: 'voip'
      },
      code: 200
    }
  });
}
