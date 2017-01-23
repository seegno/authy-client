
/**
 * Module dependencies.
 */

import * as qs from 'qs';
import { Violation } from 'validator.js';
import { createHmac } from 'crypto';
import { parse } from 'url';

/**
 * Export `SignatureAssert`.
 */

export default function signatureAssert({ key, request } = {}) {
  // Class name.
  this.__class__ = 'Signature';

  if (!key) {
    throw new Error('Key is missing');
  }

  if (!request) {
    throw new Error(`Request is missing`);
  }

  this.key = key;
  this.request = request;

  // Validation algorithm.
  this.validate = value => {
    if (request.method === 'GET') {
      return true;
    }

    const { body, headers: { 'x-authy-signature-nonce': nonce, host }, method, protocol, url: path } = this.request;
    const url = parse(`${protocol}://${host}${path}`, true);

    // Stringify body using sorted keys and encoding spaces as "+" instead of "%20".
    const encoded = qs.stringify(body, {
      arrayFormat: 'brackets',
      sort: (a, b) => a.localeCompare(b)
    }).replace(/%20/g, '+');

    const data = `${nonce}|${method}|${url.protocol}//${url.host}${url.pathname}|${encoded}`;
    const signature = createHmac('sha256', this.key).update(data).digest('base64');

    if (signature !== value) {
      throw new Violation(this, value);
    }

    return true;
  };

  return this;
}
