
/**
 * Module dependencies.
 */

import nock from 'nock';

/**
 * Mock a POST request to start a phone verification.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .post('/protected/json/phones/verification/start', request.body)
    .query(request.query ? request.query : true)
    .reply(response.code, response.body);
}

/**
 * Export a request that will `succeed`.
 */

export function succeed({ request } = {}) {
  let message = `Text message sent +1 111-111-1111`;

  if (request && request.body.via === 'call') {
    message = `Call to +1 111-111-1111 initiated`;
  }

  return mock({
    request,
    response: {
      body: {
        carrier: 'AT&T Mobility (New Cingular Wireless PCS, LLC)',
        is_cellphone: true,
        is_ported: false,
        message,
        success: true
      },
      code: 200
    }
  });
}
