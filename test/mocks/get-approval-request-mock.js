
/**
 * Module dependencies.
 */

import { defaults } from 'lodash';
import nock from 'nock';
import uuid from '../utils/uuid';

/**
 * Mock a GET request to retrieve the status of an approval request.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/key=.*?(&|$)/, 'key={key}$1').replace(/[\w]{8}(-[\w]{4}){3}-[\w]{12}/, '{id}'))
    .get('/onetouch/json/approval_requests/{id}')
    .query(request.query ? defaults({ api_key: '{key}' }, request.query) : true)
    .reply(response.code, response.body);
}

/**
 * Export a request that will `succeed`.
 */

export function succeed({ request, status = 'approved' } = {}) {
  const now = new Date().toISOString();
  const createdAt = now;
  const updatedAt = now;

  let processedAt;

  if (status === 'pending') {
    processedAt = null;
  }

  return mock({
    request,
    response: {
      body: {
        approval_request: {
          _app_name: 'Test',
          _app_serial_id: '29225',
          _authy_id: '1635',
          _id: '56ad18731170706b7f00e352',
          _user_email: 'foo@bar.com',
          app_id: '56aaaed561709030f4003b30',
          created_at: createdAt,
          notified: false,
          processed_at: processedAt,
          status,
          updated_at: updatedAt,
          user_id: '52e71d989d29c9d3dc001951',
          uuid: uuid()
        },
        success: true
      },
      code: 200
    }
  });
}
