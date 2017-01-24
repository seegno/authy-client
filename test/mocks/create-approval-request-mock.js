
/**
 * Module dependencies.
 */

import nock from 'nock';
import uuid from '../utils/uuid';

/**
 * Mock a POST request to create an approval request.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/\d+/, '{authyId}'))
    .post('/onetouch/json/users/{authyId}/approval_requests', request.body)
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
        approval_request: {
          uuid: uuid()
        },
        success: true
      },
      code: 200
    }
  });
}
