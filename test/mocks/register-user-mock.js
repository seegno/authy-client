
/**
 * Module dependencies.
 */

import nock from 'nock';
import { defaults } from 'lodash';

/**
 * Mock a POST request to register a user's activity.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/\=[^&].+/, '={key}'))
    .post('/protected/json/users/new', request.body)
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
        message: 'User created successfully.',
        success: true,
        user: {
          id: 1635
        }
      },
      code: 200
    }
  });
}
