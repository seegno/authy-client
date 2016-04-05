
/**
 * Module dependencies.
 */

import Promise from 'bluebird';
import _ from 'lodash';
import debugnyan from './logging/debugnyan';
import esc from 'url-escape-tag';
import manifest from '../package';
import parsePhone from './parsers/phone-parser';
import parseResponse from './parsers/response-parser';
import request from 'request';
import { Assert, validateRequest, validateResponse } from './validator';

/**
 * Instances.
 */

const log = debugnyan('authy:client');

/**
 * Sources arguments due to optional callback function.
 */

function source(...args) {
  const last = _.last(args);

  let callback;

  if (_.isFunction(last)) {
    callback = last;
    args = _.dropRight(args);
  }

  return [args, callback];
}

/**
 * Client.
 */

export default class Client {
  constructor({ key } = {}, { host = 'https://api.authy.com', timeout = 5000 } = {}) {
    validateRequest({ host, key, timeout }, {
      host: [new Assert().IsString(), new Assert().Choice(['https://api.authy.com', 'https://sandbox-api.authy.com'])],
      key: [new Assert().Required(), new Assert().NotBlank()],
      timeout: [new Assert().Integer(), new Assert().GreaterThanOrEqual(0)]
    });

    this.key = key;
    this.host = host;
    this.timeout = timeout;

    // Request default options.
    this.defaults = {
      headers: {
        'User-Agent': `${manifest.name}/${manifest.version} (${manifest.homepage})`
      },
      json: true,
      strictSSL: true,
      timeout: this.timeout
    };

    this.rpc = Promise.promisifyAll(request.defaults(_.defaultsDeep({
      baseUrl: `${this.host}/protected/json/`,
      qs: { api_key: this.key }
    }, this.defaults)), { multiArgs: true });

    this.onetouch = Promise.promisifyAll(request.defaults(_.defaultsDeep({
      baseUrl: `${this.host}/onetouch/json/`
    }, this.defaults)), { multiArgs: true });

    log.debug({ host }, `Host set to ${host}`);
  }

  /**
   * Create approval request.
   */

  createApprovalRequest(...args) {
    return Promise.try(() => {
      const [[{ authyId, details = {}, logos, message } = {}, { ttl } = {}], callback] = source(...args);

      validateRequest({ authyId, details, logos, message, ttl }, {
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        details: {
          hidden: new Assert().PlainObject(),
          visible: new Assert().PlainObject()
        },
        logos: [new Assert().Collection(new Assert().Logo()), new Assert().Length({ min: 1 })],
        message: [new Assert().Required(), new Assert().IsString(), new Assert().Length({ max: 144 })],
        ttl: new Assert().Integer()
      });

      return this.onetouch.postAsync({
        form: {
          api_key: this.key,
          details: details.visible,
          hidden_details: details.hidden,
          logos,
          message,
          seconds_to_expire: ttl
        },
        uri: esc`users/${authyId}/approval_requests`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          approval_request: {
            uuid: [new Assert().Required(), new Assert().IsString()]
          }
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Delete a user from the application.
   */

  deleteUser(...args) {
    return Promise.try(() => {
      const [[{ authyId } = {}, { ip } = {}], callback] = source(...args);

      log.debug({ authyId }, `Deleting user ${authyId}`);

      validateRequest({ authyId, ip }, {
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        ip: new Assert().Ip()
      });

      return this.rpc.postAsync({
        form: _.pickBy({
          user_ip: ip
        }, _.identity),
        uri: esc`users/${authyId}/delete`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().EqualTo('User was added to remove.')]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Retrieve application details.
   */

  getApplicationDetails(...args) {
    return Promise.try(() => {
      const [[{ ip } = {}], callback] = source(...args);

      log.debug('Retrieving application details');

      validateRequest({ ip }, { ip: new Assert().Ip() });

      return this.rpc.getAsync({
        qs: _.pickBy({
          user_ip: ip
        }, _.identity),
        uri: esc`app/details`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          app: {
            app_id: [new Assert().Required(), new Assert().Integer()],
            name: [new Assert().Required(), new Assert().IsString()],
            plan: [new Assert().Required(), new Assert().IsString()],
            sms_enabled: [new Assert().Required(), new Assert().Boolean()]
          },
          message: [new Assert().Required(), new Assert().EqualTo('Application information.')]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Retrieve approval request information.
   */

  getApprovalRequest(...args) {
    return Promise.try(() => {
      const [[{ id } = {}], callback] = source(...args);

      validateRequest({ id }, {
        id: [new Assert().Required(), new Assert().IsString()]
      });

      return this.onetouch.getAsync({
        qs: {
          api_key: this.key
        },
        uri: esc`approval_requests/${id}`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          approval_request: {
            _app_name: [new Assert().Required(), new Assert().IsString()],
            _app_serial_id: [new Assert().Required(), new Assert().IsString()],
            _authy_id: [new Assert().Required(), new Assert().AuthyId()],
            _id: [new Assert().Required(), new Assert().IsString()],
            _user_email: [new Assert().Required(), new Assert().Email()],
            app_id: [new Assert().Required(), new Assert().IsString()],
            created_at: [new Assert().Required(), new Assert().Date()],
            notified: [new Assert().Required(), new Assert().Boolean()],
            processed_at: new Assert().Callback(value => new Assert().Null().check(value) === true || new Assert().Date().check(value) === true),
            status: [new Assert().Required(), new Assert().Choice(['approved', 'denied', 'pending'])],
            updated_at: [new Assert().Required(), new Assert().Date()],
            user_id: [new Assert().Required(), new Assert().IsString()],
            uuid: [new Assert().Required(), new Assert().IsString()]
          }
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Retrieve application statistics.
   */

  getApplicationStatistics(...args) {
    return Promise.try(() => {
      const [[{ ip } = {}], callback] = source(...args);

      log.debug('Retrieving application statistics');

      validateRequest({ ip }, { ip: new Assert().Ip() });

      return this.rpc.getAsync({
        qs: _.pickBy({
          user_ip: ip
        }, _.identity),
        uri: esc`app/stats`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          app_id: [new Assert().Required(), new Assert().Integer()],
          count: [new Assert().Required(), new Assert().Integer()],
          message: [new Assert().Required(), new Assert().EqualTo('Monthly statistics.')],
          stats: [new Assert().Required(), new Assert().Collection(new Assert().EqualKeys(['api_calls_count', 'auths_count', 'calls_count', 'month', 'sms_count', 'users_count', 'year']))],
          total_users: [new Assert().Required(), new Assert().Integer()]
        });
      })
      .asCallback(callback);
    });
  }

  getPhoneInformation(...args) {
    return Promise.try(() => {
      const [[{ countryCode: countryOrCallingCode, phone } = {}, { ip } = {}], callback] = source(...args);

      validateRequest({ countryCode: countryOrCallingCode, ip, phone }, {
        countryCode: [new Assert().Required(), new Assert().CountryOrCallingCode()],
        ip: new Assert().Ip(),
        phone: [new Assert().Required(), new Assert().Phone(countryOrCallingCode)]
      });

      const parsed = parsePhone({ countryOrCallingCode, phone });

      return this.rpc.getAsync({
        qs: {
          country_code: parsed.countryCallingCode,
          phone_number: parsed.phone,
          user_ip: ip
        },
        uri: esc`phones/info`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().Regexp('Phone number information as of \\d+-\\d+-\\d+ \\d+:\\d+:\\d+ UTC')],
          ported: [new Assert().Required(), new Assert().Boolean()],
          provider: [new Assert().Required(), new Assert().IsString()],
          type: [new Assert().Required(), new Assert().IsString()]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Retrieve a user's status.
   */

  getUserStatus(...args) {
    return Promise.try(() => {
      const [[{ authyId } = {}, { ip } = {}], callback] = source(...args);

      log.debug({ authyId }, `Retrieving user ${authyId} status`);

      validateRequest({ authyId, ip }, {
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        ip: new Assert().Ip()
      });

      return this.rpc.getAsync({
        form: _.pickBy({
          user_ip: ip
        }, _.identity),
        uri: esc`users/${authyId}/status`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().EqualTo('User status.')],
          status: {
            authy_id: [new Assert().Required(), new Assert().AuthyId()],
            confirmed: [new Assert().Required(), new Assert().Boolean()],
            country_code: [new Assert().Required(), new Assert().CountryOrCallingCode()],
            devices: new Assert().Required(),
            has_hard_token: [new Assert().Required(), new Assert().Boolean()],
            phone_number: [new Assert().Required(), new Assert().IsString()],
            registered: [new Assert().Required(), new Assert().Boolean()]
          }
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Register a user activity.
   */

  registerActivity(...args) {
    return Promise.try(() => {
      const [[{ authyId, data, type } = {}, { ip } = {}], callback] = source(...args);

      log.debug(`Registering activity for user ${authyId}`);

      validateRequest({ authyId, data, ip, type }, {
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        data: [new Assert().Required(), new Assert().PlainObject()],
        ip: [new Assert().Required(), new Assert().Ip()],
        type: [new Assert().Required(), new Assert().Activity()]
      });

      return this.rpc.postAsync({
        form: {
          data,
          type,
          user_ip: ip
        },
        uri: esc`users/${authyId}/register_activity`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().EqualTo('Activity was created.')]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Request a call with a token for users that don't own a smartphone or are
   * having trouble with SMS. If the Authy app is in use by the user, this
   * request is ignored. Pass `force` to call the user regardless of this.
   */

  requestCall(...args) {
    return Promise.try(() => {
      const [[{ authyId } = {}, { action, message, force = false } = {}], callback] = source(...args);

      log.debug(`Requesting call for user ${authyId}`);

      validateRequest({ action, authyId, force, message }, {
        action: [new Assert().IsString(), new Assert().Length({ max: 255, min: 1 })],
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        force: new Assert().Boolean(),
        message: [new Assert().IsString(), new Assert().Length({ max: 255, min: 1 })]
      });

      return this.rpc.getAsync({
        qs: _.pickBy({
          action,
          action_message: message,
          force
        }),
        uri: esc`call/${authyId}`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          cellphone: [new Assert().Required(), new Assert().IsString()],
          device: new Assert().IsString(),
          ignored: new Assert().Boolean(),
          message: [new Assert().Required(), new Assert().IsString()]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Request an sms with a token for users that don't own a smartphone. If the
   * Authy app is in use by the user, this request is ignored. Pass `force` to
   * send an sms regardless of this.
   */

  requestSms(...args) {
    return Promise.try(() => {
      const [[{ authyId } = {}, { action, force = false, message } = {}], callback] = source(...args);

      log.debug(`Requesting sms for user ${authyId}`);

      validateRequest({ action, authyId, force, message }, {
        action: [new Assert().IsString(), new Assert().Length({ max: 255, min: 1 })],
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        force: new Assert().Boolean(),
        message: [new Assert().IsString(), new Assert().Length({ max: 255, min: 1 })]
      });

      return this.rpc.getAsync({
        qs: _.pickBy({
          action,
          action_message: message,
          force
        }),
        uri: esc`sms/${authyId}`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          cellphone: [new Assert().Required(), new Assert().IsString()],
          device: new Assert().IsString(),
          ignored: new Assert().Boolean(),
          message: [new Assert().Required(), new Assert().IsString()]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Enable two-factor authentication on a user. The returned `authyId` field should be stored for
   * subsequent calls.
   */

  registerUser(...args) {
    return Promise.try(() => {
      const [[{ countryCode: countryOrCallingCode, email, phone } = {}], callback] = source(...args);

      log.debug(`Registering user with email ${email} and phone ${phone} (${countryOrCallingCode})`);

      validateRequest({ countryCode: countryOrCallingCode, email, phone }, {
        countryCode: [new Assert().Required(), new Assert().CountryOrCallingCode()],
        email: [new Assert().Required(), new Assert().Email()],
        phone: [new Assert().Required(), new Assert().Phone(countryOrCallingCode)]
      });

      const parsed = parsePhone({ countryOrCallingCode, phone });

      return this.rpc.postAsync({
        form: {
          user: {
            cellphone: parsed.phone,
            country_code: parsed.countryCallingCode,
            email
          }
        },
        uri: esc`users/new`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().EqualTo('User created successfully.')],
          user: {
            id: [new Assert().Required(), new Assert().AuthyId()]
          }
        });
      })
      .asCallback(callback);
    });
  }

 /**
  * Verify a token submitted by a user.
  */

  verifyToken(...args) {
    return Promise.try(() => {
      const [[{ authyId, token } = {}, { force = false } = {}], callback] = source(...args);

      log.debug(`Verifying token ${token} for user ${authyId}`);

      validateRequest({ authyId, force, token }, {
        authyId: [new Assert().Required(), new Assert().AuthyId()],
        force: new Assert().Boolean(),
        token: [new Assert().Required(), new Assert().TotpToken()]
      });

      return this.rpc.getAsync({
        qs: _.pickBy({
          force
        }),
        uri: esc`verify/${token}/${authyId}`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().EqualTo('Token is valid.')],
          token: [new Assert().Required(), new Assert().EqualTo('is valid')]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Start a phone verification using the Phone Verification API.
   */

  startPhoneVerification(...args) {
    return Promise.try(() => {
      const [[{ countryCode: countryOrCallingCode, phone, via } = {}, { locale } = {}], callback] = source(...args);

      validateRequest({ countryCode: countryOrCallingCode, phone, via }, {
        countryCode: [new Assert().Required(), new Assert().CountryOrCallingCode()],
        locale: new Assert().Locale(),
        phone: [new Assert().Required(), new Assert().Phone(countryOrCallingCode)],
        via: [new Assert().Required(), new Assert().VerificationVia()]
      });

      const parsed = parsePhone({ countryOrCallingCode, phone });

      return this.rpc.postAsync({
        form: _.pickBy({
          country_code: parsed.countryCallingCode,
          locale,
          phone_number: parsed.phone,
          via
        }, _.identity),
        uri: esc`phones/verification/start`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          carrier: [new Assert().Required(), new Assert().IsString()],
          is_cellphone: [new Assert().Required(), new Assert().Boolean()],
          is_ported: [new Assert().Required(), new Assert().Boolean()],
          message: [new Assert().Required(), new Assert().IsString()]
        });
      })
      .asCallback(callback);
    });
  }

  /**
   * Verify a callback from Authy.
   *
   * Currently only the verification of authenticity of approval requests (Authy OneTouch) is supported.
   */

  verifyCallback(...args) {
    const [[request = {}], callback] = source(...args);

    return Promise.try(() => {
      validateRequest(request, {
        body: {
          approval_request: [new Assert().Required(), new Assert().Callback(value => {
            return new Assert().IsString().check(value) === true || new Assert().PlainObject().check(value) === true;
          })],
          authy_id: [new Assert().Required(), new Assert().AuthyId()],
          callback_action: [new Assert().Required(), new Assert().Choice(['approval_request_status'])],
          device_uuid: [new Assert().Required(), new Assert().IsString()],
          signature: [new Assert().Required(), new Assert().IsString()],
          status: [new Assert().Required(), new Assert().Choice(['approved', 'denied'])],
          uuid: [new Assert().Required(), new Assert().IsString()]
        },
        headers: {
          'x-authy-signature': [new Assert().IsString(), new Assert().Signature({ key: this.key, request })],
          'x-authy-signature-nonce': [new Assert().Integer()]
        },
        method: [new Assert().Required(), new Assert().Choice(['GET', 'POST'])],
        protocol: [new Assert().Required(), new Assert().Choice(['http', 'https'])],
        url: [new Assert().Required(), new Assert().IsString()]
      });

      return Promise.resolve(request).asCallback(callback);
    });
  }

  /**
   * Verify a phone using the Phone Verification API.
   */

  verifyPhone(...args) {
    return Promise.try(() => {
      const [[{ countryCode: countryOrCallingCode, phone, token } = {}], callback] = source(...args);

      validateRequest({ countryCode: countryOrCallingCode, phone, token }, {
        countryCode: [new Assert().Required(), new Assert().CountryOrCallingCode()],
        phone: [new Assert().Required(), new Assert().Phone(countryOrCallingCode)],
        token: [new Assert().Required(), new Assert().Integer()]
      });

      const parsed = parsePhone({ countryOrCallingCode, phone });

      return this.rpc.getAsync({
        qs: {
          country_code: parsed.countryCallingCode,
          phone_number: parsed.phone,
          verification_code: token
        },
        uri: esc`phones/verification/check`
      })
      .bind(this)
      .then(parseResponse)
      .tap(response => {
        validateResponse(response, {
          message: [new Assert().Required(), new Assert().EqualTo('Verification code is correct.')]
        });
      })
      .asCallback(callback);
    });
  }
}
