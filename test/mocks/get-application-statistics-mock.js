
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults, random, times } from 'lodash';

/**
 * List of month names.
 */

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Mock a GET request to retrieve application statistics.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/key=.*?(&|$)/, 'key={key}$1'))
    .get('/protected/json/app/stats')
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
        app_id: 1,
        count: 12,
        message: 'Monthly statistics.',
        stats: times(12, index => ({
          api_calls_count: random(0, 100),
          auths_count: random(0, 100),
          calls_count: random(0, 100),
          month: months[index],
          sms_count: random(0, 100),
          users_count: random(0, 100),
          year: 2015
        })),
        success: true,
        total_users: 100
      },
      code: 200
    }
  });
}
