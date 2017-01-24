
/**
 * Module dependencies.
 */

import nock from 'nock';

/**
 * Mock a POST request to register a user's activity.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .post('/protected/json/users/new', request.body)
    .query(request.query ? request.query : true)
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
