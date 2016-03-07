
/**
 * Module dependencies.
 */

import nock from 'nock';

/**
 * Mock a POST request to delete a user.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/\=[^&].+/, '={key}').replace(/\/[0-9].*\//, '/{authyId}/'))
    .post('/protected/json/users/{authyId}/delete?api_key={key}', request.body)
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
        message: 'User was added to remove.',
        success: true
      },
      code: 200
    }
  });
}
