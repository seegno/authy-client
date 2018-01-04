
/**
 * Module dependencies.
 */

import nock from 'nock';

/**
 * Mock a GET request to send verification token via sms.
 */

function mock({ request = {}, response = {} }) {
  return nock(/\.authy\.com/)
    .filteringPath(path => path.replace(/\/[0-9]+/, '/{authyId}'))
    .get('/protected/json/sms/{authyId}')
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
        cellphone: '+351-XXX-XXX-XX67',
        message: 'SMS token was sent',
        success: true
      },
      code: 200
    }
  });
}

/**
 * Export a request that will `succeed` with `force=true`.
 */

export function succeedWithForce() {
  return succeed({ request: { query: { force: true } } });
}

/**
 * Export a request that will `succeed` with SMS ignored.
 */

export function succeedWithSmsIgnored() {
  return mock({
    response: {
      body: {
        cellphone: '+351-XXX-XXX-XX67',
        device: 'iphone',
        ignored: true,
        message: 'Ignored: SMS is not needed for smartphones. Pass force=true if you want to actually send it anyway.',
        success: true
      },
      code: 200
    }
  });
}
