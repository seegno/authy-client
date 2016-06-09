'use strict';

var _mocks = require('./mocks');

var mocks = _interopRequireWildcard(_mocks);

var _client = require('../src/client');

var _client2 = _interopRequireDefault(_client);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _errors = require('../src/errors');

var _enums = require('../src/enums');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
/**
 * Module dependencies.
 */

/**
 * Disable any type net connection.
 */

_nock2.default.disableNetConnect();

/**
 * Test `Client`.
 */

afterEach(() => {
  if (_nock2.default.pendingMocks().length) {
    throw new Error(`Unexpected pending mocks ${ JSON.stringify(_nock2.default.pendingMocks()) }`);
  }

  _nock2.default.cleanAll();
});

describe('Client', () => {
  const client = new _client2.default({ key: '1DS9YIwGquvvIdx8GdcdqZGLAewZZyhd' });

  describe('constructor', () => {
    it('should throw an error if `key` is missing', () => {
      try {
        new _client2.default();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.key.show().assert.should.equal('HaveProperty');
      }
    });

    it('should throw an error if `host` is invalid', () => {
      try {
        new _client2.default({ key: 'foo' }, { host: 'https://foo.bar' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.host[0].show().assert.should.equal('Choice');
        e.errors.host[0].show().violation.choices.should.eql(['https://api.authy.com', 'https://sandbox-api.authy.com']);
      }
    });

    it('should throw an error if `timeout` is invalid', () => {
      try {
        new _client2.default({ key: 'foo' }, { timeout: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.timeout[0].show().assert.should.equal('Integer');
      }
    });

    it('should set default host to production', () => {
      const testClient = new _client2.default({ key: 'foo' });

      testClient.host.should.equal('https://api.authy.com');
    });

    it('should set default timeout to 5000ms', () => {
      const testClient = new _client2.default({ key: 'foo' });

      testClient.timeout.should.equal(5000);
    });

    it('should set default strict ssl to `true`', () => {
      const testClient = new _client2.default({ key: 'foo' });

      testClient.defaults.strictSSL.should.be.true();
    });

    it('should set default json encoding to `true`', () => {
      const testClient = new _client2.default({ key: 'foo' });

      testClient.defaults.json.should.be.true();
    });

    it('should set default user-agent', () => {
      const testClient = new _client2.default({ key: 'foo' });

      testClient.defaults.headers['User-Agent'].should.match(/authy-client\/\d+\.\d+\.\d+\s\(https:\/\/github.com\/seegno\/authy-client\)/);
    });
  });

  describe('startPhoneVerification()', () => {
    it('should throw an error if `countryCode` is missing', _asyncToGenerator(function* () {
      try {
        yield client.startPhoneVerification();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `countryCode` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.startPhoneVerification({ countryCode: {} });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode[0].show().assert.should.equal('CountryOrCallingCode');
      }
    }));

    it('should throw an error if `phone` is missing', _asyncToGenerator(function* () {
      try {
        yield client.startPhoneVerification();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `phone` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.startPhoneVerification({ phone: {} });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone[0].show().assert.should.equal('Phone');
      }
    }));

    it('should throw an error if `via` is missing', _asyncToGenerator(function* () {
      try {
        yield client.startPhoneVerification();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.via.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `via` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.startPhoneVerification({ via: 'foobar' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.via[0].show().assert.should.equal('VerificationVia');
        e.errors.via[0].show().violation.choices.should.not.be.empty();
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { success: true });

      try {
        yield client.startPhoneVerification({ countryCode: 'US', locale: 'es', phone: '7754615609', via: _enums.verificationVia.SMS });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.is_cellphone.show().assert.should.equal('HaveProperty');
        e.errors.is_ported.show().assert.should.equal('HaveProperty');
        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { carrier: 123, is_cellphone: 'true', is_ported: 'true', message: 123, success: true });

      try {
        yield client.startPhoneVerification({ countryCode: 'US', locale: 'es', phone: '7754615609', via: _enums.verificationVia.SMS });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.carrier[0].show().assert.should.equal('IsString');
        e.errors.is_cellphone[0].show().assert.should.equal('Boolean');
        e.errors.is_ported[0].show().assert.should.equal('Boolean');
        e.errors.message[0].show().assert.should.equal('IsString');
      }
    }));

    it('should start a phone verification', _asyncToGenerator(function* () {
      mocks.startPhoneVerification.succeed({
        request: {
          body: {
            country_code: '1',
            locale: 'es',
            phone_number: '7754615609',
            via: 'sms'
          }
        }
      });

      const phoneVerification = yield client.startPhoneVerification({ countryCode: 'US', phone: '7754615609', via: _enums.verificationVia.SMS }, { locale: 'es' });

      phoneVerification.should.have.keys('carrier', 'is_ported', 'is_cellphone', 'message', 'success');
    }));

    it('should accept a callback', done => {
      mocks.startPhoneVerification.succeed();

      client.startPhoneVerification({ countryCode: 'US', locale: 'es', phone: '7754615609', via: _enums.verificationVia.SMS }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('verifyCallback()', () => {
    it('should throw an error if `body.approval_request` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.approval_request.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.approval_request` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { approval_request: 123 }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.approval_request[0].show().assert.should.equal('Callback');
      }
    }));

    it('should throw an error if `body.authy_id` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.authy_id.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.authy_id` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { authy_id: 'FOO' }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.authy_id[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `body.callback_action` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.callback_action.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.callback_action` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { callback_action: 123 }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.callback_action[0].show().assert.should.equal('Choice');
      }
    }));

    it('should throw an error if `body.device_uuid` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.device_uuid.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.device_uuid` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { device_uuid: 123 }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.device_uuid[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `body.signature` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.signature.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.signature` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { signature: 123 }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.signature[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `body.status` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.status.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.status` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { status: 'foo' }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.status[0].show().assert.should.equal('Choice');
      }
    }));

    it('should throw an error if `body.uuid` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: {}, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.uuid.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `body.uuid` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ body: { uuid: 123 }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.body.uuid[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `headers.x-authy-signature` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ headers: { 'x-authy-signature': 123 }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.headers['x-authy-signature'][0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `method` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.method.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `method` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ method: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.method[0].show().assert.should.equal('Choice');
      }
    }));

    it('should throw an error if `protocol` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.protocol.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `protocol` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ protocol: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.protocol[0].show().assert.should.equal('Choice');
      }
    }));

    it('should throw an error if `url` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.url.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `url` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ url: 123 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.url[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `headers.x-authy-signature` does not match request', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({
          body: {
            approval_request: {},
            authy_id: 1234567,
            callback_action: 'approval_request_status',
            device_uuid: '3d89c320-a9bb-0133-7c02-0e67b818e6fb',
            signature: 'bObhJgZwgU7O9r4Uo9VT6j6shAOe7y/IRGpW/N0Uq34/XHZU9E+aHOI5rcQzW1ZgNCECzVrqrsnjhYEK4Zq1naKWu0YNkuvILmMz8IxJEQH+c+6x186fjIjxvP4nu4p/pfUDomo/za24s1XOjtNlVsrDTDXClHUh5MjFQbyBjhFd8gOtmGVatN7K2Lx71I8YR2JDLbRX4DlJEMu++PLBn1nqQH9tbNYzX5jjX87CXPBtDfRwfWSs/imnfZ9zkDq4ZKuBcuwzQNsxKlby6782X0o78rYhCHrcDnHgRtyMGvX9ovK3XTt6M7p6i9SKaRgBWIOFVPygxv15iJesqt9cng==',
            status: 'approved',
            uuid: '996221c0-b8a7-0133-7c06-0e67b818e6fb'
          },
          headers: {
            host: 'foo.bar',
            'x-authy-signature': 'auCQ/qxS6TgwVzOuiWFwU93ZLe8trNoxznJMRfogzeo=',
            'x-authy-signature-nonce': 1455825429
          },
          method: 'POST',
          protocol: 'https',
          url: '/'
        });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.headers['x-authy-signature'][0].show().assert.should.equal('Signature');
      }
    }));

    it('should throw an error if `headers.x-authy-signature-nonce` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyCallback({ headers: { 'x-authy-signature-nonce': 'foo' }, method: 'POST', protocol: 'http', url: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.headers['x-authy-signature-nonce'][0].show().assert.should.equal('Integer');
      }
    }));

    it('should verify the signature of a POST request', _asyncToGenerator(function* () {
      yield client.verifyCallback({
        body: {
          approval_request: {
            expiration_timestamp: 1455911778,
            logos: null,
            transaction: {
              created_at_time: 1455825378,
              customer_uuid: '2ccf0040-ed25-0132-5987-0e67b818e6fb',
              details: {},
              device_details: null,
              device_geolocation: null,
              device_signing_time: 0,
              encrypted: false,
              flagged: false,
              hidden_details: {},
              message: '.',
              reason: null,
              requester_details: null,
              status: 'approved',
              uuid: '996201c0-b7a7-0133-7c06-0e67b818e6fb'
            }
          },
          authy_id: 1234567,
          callback_action: 'approval_request_status',
          device_uuid: '4d89c320-a9bb-0133-7c02-0e67b818e6fb',
          signature: 'BObhJgZwgU7O9r4Uo9VT6j6shAOe7y/IRGpW/N0Uq34/XHZU9E+aHOI5rcQzW1ZgNCECzVrqrsnjhYEK4Zq1naKWu0YNkuvILmMz8IxJEQH+c+6x186fjIjxvP4nu4p/pfUDomo/za24s1XOjtNlVsrDTDXClHUh5MjFQbyBjhFd8gOtmGVatN7K2Lx71I8YR2JDLbRX4DlJEMu++PLBn1nqQH9tbNYzX5jjX87CXPBtDfRwfWSs/imnfZ9zkDq4ZKuBcuwzQNsxKlby6782X0o78rYhCHrcDnHgRtyMGvX9ovK3XTt6M7p6i9SKaRgBWIOFVPygxv15iJesqt9cng==',
          status: 'approved',
          uuid: '996221c0-b7a7-0133-7c06-0e67b818e6fb'
        },
        headers: {
          host: 'foo.bar',
          'x-authy-signature': 'hqB6las54sMBA83GKs0U1QQi9ocJ2tH20SXHZNzfqqQ=',
          'x-authy-signature-nonce': 1455825429
        },
        method: 'POST',
        protocol: 'https',
        url: '/'
      });
    }));

    it('should skip signature verification of a GET request', _asyncToGenerator(function* () {
      yield client.verifyCallback({
        body: {
          approval_request: '%7B%22transaction%22%3D%3E%7B%22details%22%3D%3E%7B%7D%2C+%22device_details%22%3D%3Enil%2C+%22device_geolocation%22%3D%3Enil%2C+%22device_signing_time%22%3D%3E0%2C+%22encrypted%22%3D%3Efalse%2C+%22flagged%22%3D%3Efalse%2C+%22hidden_details%22%3D%3E%7B%7D%2C+%22message%22%3D%3E%22.%22%2C+%22reason%22%3D%3Enil%2C+%22requester_details%22%3D%3Enil%2C+%22status%22%3D%3E%22approved%22%2C+%22uuid%22%3D%3E%2290c2adc0-b184-0133-7bff-0e67b818e6fb%22%2C+%22created_at_time%22%3D%3E1455040673%2C+%22customer_uuid%22%3D%3E%222ccf1041-ad25-0132-5987-0e67b818e6fb%22%7D%2C+%22logos%22%3D%3Enil%2C+%22expiration_timestamp%22%3D%3E1455127073%7D',
          authy_id: '1234567',
          callback_action: 'approval_request_status',
          device_uuid: '4d89c320-a9bb-0133-7c02-0e67b818e6fb',
          signature: 'axMMVd3wkVGDNG1FjXA5wIuX7Nd2mSoVgETdvlFbV%2FnXzeLiwzdn2G2khptH0fhSQU%2FWb5pnSwn0TqK0IiRBx4yBYJdm4s1zdiA0q8yrLYqnpVPYdCyKcB1I6qnn7ASLbXanKQ9U4C%2B4zL9D5OJd7bUHr3qnDbJ67nERTeOnzlJ8OS8CgJBz18jFGfXL3ImGoE5h3JJBt0ciFliq%2F15xbvJgHM6%2BPaJ62txVXoKTbsdUpWrML2w7bFjahOrOGFZZG1FuW597YOmQdI9Vo%2Fmp%2Fh8yf7CseOTUdZGFTHACFlAQ6qOTg2JCHLI6TsT2v2dyokwlZgkamkEo8pyiikOcbw%3D%3D',
          status: 'approved',
          uuid: '90c2aac0-b184-0133-7bff-0e67b818e6fb'
        },
        headers: {
          host: 'foo.bar'
        },
        method: 'GET',
        protocol: 'https',
        url: '/'
      });
    }));

    it('should return the original request', _asyncToGenerator(function* () {
      const request = {
        body: {
          approval_request: '%7B%22transaction%22%3D%3E%7B%22details%22%3D%3E%7B%7D%2C+%22device_details%22%3D%3Enil%2C+%22device_geolocation%22%3D%3Enil%2C+%22device_signing_time%22%3D%3E0%2C+%22encrypted%22%3D%3Efalse%2C+%22flagged%22%3D%3Efalse%2C+%22hidden_details%22%3D%3E%7B%7D%2C+%22message%22%3D%3E%22.%22%2C+%22reason%22%3D%3Enil%2C+%22requester_details%22%3D%3Enil%2C+%22status%22%3D%3E%22approved%22%2C+%22uuid%22%3D%3E%2290c2adc0-b184-0133-7bff-0e67b818e6fb%22%2C+%22created_at_time%22%3D%3E1455040673%2C+%22customer_uuid%22%3D%3E%222ccf1041-ad25-0132-5987-0e67b818e6fb%22%7D%2C+%22logos%22%3D%3Enil%2C+%22expiration_timestamp%22%3D%3E1455127073%7D',
          authy_id: '1234567',
          callback_action: 'approval_request_status',
          device_uuid: '4d89c320-a9bb-0133-7c02-0e67b818e6fb',
          signature: 'axMMVd3wkVGDNG1FjXA5wIuX7Nd2mSoVgETdvlFbV%2FnXzeLiwzdn2G2khptH0fhSQU%2FWb5pnSwn0TqK0IiRBx4yBYJdm4s1zdiA0q8yrLYqnpVPYdCyKcB1I6qnn7ASLbXanKQ9U4C%2B4zL9D5OJd7bUHr3qnDbJ67nERTeOnzlJ8OS8CgJBz18jFGfXL3ImGoE5h3JJBt0ciFliq%2F15xbvJgHM6%2BPaJ62txVXoKTbsdUpWrML2w7bFjahOrOGFZZG1FuW597YOmQdI9Vo%2Fmp%2Fh8yf7CseOTUdZGFTHACFlAQ6qOTg2JCHLI6TsT2v2dyokwlZgkamkEo8pyiikOcbw%3D%3D',
          status: 'approved',
          uuid: '90c2aac0-b184-0133-7bff-0e67b818e6fb'
        },
        headers: {
          host: 'foo.bar'
        },
        method: 'GET',
        protocol: 'https',
        url: '/'
      };

      (yield client.verifyCallback(request)).should.equal(request);
    }));
  });

  describe('verifyPhone()', () => {
    it('should throw an error if `countryCode` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyPhone();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `countryCode` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyPhone({ countryCode: {} });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode[0].show().assert.should.equal('CountryOrCallingCode');
      }
    }));

    it('should throw an error if `phone` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyPhone();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `phone` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyPhone({ phone: {} });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone[0].show().assert.should.equal('Phone');
      }
    }));

    it('should throw an error if `token` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyPhone();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.token.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `token` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyPhone({ token: 1234 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.token[0].show().assert.should.equal('PhoneToken');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { carrier: 123, is_cellphone: 'true', is_ported: 'true', message: 123, success: true });

      try {
        yield client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
      }
    }));

    it('should verify a phone', _asyncToGenerator(function* () {
      mocks.verifyPhone.succeed({
        request: {
          query: {
            api_key: '{key}',
            country_code: '1',
            phone_number: '7754615609',
            verification_code: '1234'
          }
        }
      });

      const phoneVerification = yield client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' });

      phoneVerification.should.have.keys('message', 'success');
    }));

    it('should accept a callback', done => {
      mocks.verifyPhone.succeed();

      client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('getPhoneInformation()', () => {
    it('should throw an error if `countryCode` is missing', _asyncToGenerator(function* () {
      try {
        yield client.getPhoneInformation();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `phone` is missing', _asyncToGenerator(function* () {
      try {
        yield client.getPhoneInformation();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `ip` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.getPhoneInformation({}, { ip: 'foobar' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ip[0].show().assert.should.equal('Ip');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' }, { ip: '127.0.0.1' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.ported.show().assert.should.equal('HaveProperty');
        e.errors.provider.show().assert.should.equal('HaveProperty');
        e.errors.type.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { message: 'foobar', ported: 123, provider: 123, success: true, type: 123 });

      try {
        yield client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' }, { ip: '127.0.0.1' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('Regexp');
        e.errors.ported[0].show().assert.should.equal('Boolean');
        e.errors.provider[0].show().assert.should.equal('IsString');
        e.errors.type[0].show().assert.should.equal('IsString');
      }
    }));

    it('should return information about a phone', _asyncToGenerator(function* () {
      mocks.getPhoneInformation.succeed({
        request: {
          query: {
            country_code: '1',
            phone_number: '7754615609',
            user_ip: '127.0.0.1'
          }
        }
      });

      const phoneInformation = yield client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' }, { ip: '127.0.0.1' });

      phoneInformation.should.have.keys('message', 'ported', 'provider', 'success', 'type');
    }));

    it('should accept a callback', done => {
      mocks.getPhoneInformation.succeed();

      client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' }, { ip: '127.0.0.1' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('getApprovalRequest()', () => {
    it('should throw an error if `id` is missing', _asyncToGenerator(function* () {
      try {
        yield client.getApprovalRequest();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.id.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `id` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.getApprovalRequest({ id: 123 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.id[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.approval_request.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, {
        approval_request: {
          _app_name: 123,
          _app_serial_id: 123,
          _authy_id: 'foo',
          _id: 123,
          _user_email: 'bar',
          app_id: 123,
          created_at: 'biz',
          notified: 123,
          processed_at: 123,
          status: 'net',
          updated_at: 123,
          user_id: 123,
          uuid: 123
        },
        success: true
      });

      try {
        yield client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.approval_request._app_name[0].show().assert.should.equal('IsString');
        e.errors.approval_request._app_serial_id[0].show().assert.should.equal('IsString');
        e.errors.approval_request._authy_id[0].show().assert.should.equal('AuthyId');
        e.errors.approval_request._id[0].show().assert.should.equal('IsString');
        e.errors.approval_request._user_email[0].show().assert.should.equal('Email');
        e.errors.approval_request.app_id[0].show().assert.should.equal('IsString');
        e.errors.approval_request.created_at[0].show().assert.should.equal('Date');
        e.errors.approval_request.notified[0].show().assert.should.equal('Boolean');
        e.errors.approval_request.processed_at[0].show().assert.should.equal('Callback');
        e.errors.approval_request.status[0].show().assert.should.equal('Choice');
        e.errors.approval_request.updated_at[0].show().assert.should.equal('Date');
        e.errors.approval_request.user_id[0].show().assert.should.equal('IsString');
        e.errors.approval_request.uuid[0].show().assert.should.equal('IsString');
      }
    }));

    it('should return the status of an approval request', _asyncToGenerator(function* () {
      mocks.getApprovalRequest.succeed({ status: 'pending' });

      const approvalRequest = yield client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' });

      approvalRequest.should.have.keys('approval_request', 'success');
      approvalRequest.approval_request.should.have.keys('_app_name', '_app_serial_id', '_authy_id', '_id', '_user_email', 'app_id', 'created_at', 'notified', 'processed_at', 'status', 'updated_at', 'user_id', 'uuid');
    }));

    it('should accept a callback', done => {
      mocks.getApprovalRequest.succeed();

      client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('createApprovalRequest()', () => {
    it('should throw an error if `authyId` is missing', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `message` is missing', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `details.visible` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ details: { visible: [] } });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.details.visible[0].show().assert.should.equal('PlainObject');
      }
    }));

    it('should throw an error if `details.hidden` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ details: { hidden: [] } });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.details.hidden[0].show().assert.should.equal('PlainObject');
      }
    }));

    it('should throw an error if `message` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ message: {} });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `message` is blank', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ message: '' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('Required');
      }
    }));

    it('should throw an error if `message` has more than 144 characters', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ message: 'f'.repeat(145) });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('Length');
        e.errors.message[0].show().violation.max.should.equal(144);
      }
    }));

    it('should throw an error if `logos` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ logos: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.logos[0].show().assert.should.equal('Collection');
      }
    }));

    it('should throw an error if `logos` is empty', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ logos: [] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.logos[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if any `logo` is missing resolution or url', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ logos: [{}] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.logos[0][0].show().assert.should.equal('EqualKeys');
        e.errors.logos[0][0].show().violation.difference.should.eql(['res', 'url']);
      }
    }));

    it('should throw an error if any `logo` has an invalid resolution', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ logos: [{ res: 'foo', url: 'bar' }] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.logos[0][0].show().assert.should.equal('Choice');
        e.errors.logos[0][0].show().violation.choices.should.not.be.empty();
      }
    }));

    it('should throw an error if any `logo` has an invalid url', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({ logos: [{ res: _enums.resolution.DEFAULT, url: 'bar' }] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.logos[0][0].show().assert.should.equal('Uri');
      }
    }));

    it('should throw an error if `ttl` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.createApprovalRequest({}, { ttl: [] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ttl[0].show().assert.should.equal('Integer');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { success: true });

      try {
        yield client.createApprovalRequest({ authyId: 1635, message: 'Foobar.' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.approval_request.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { approval_request: { uuid: 123 }, success: true });

      try {
        yield client.createApprovalRequest({ authyId: 1635, message: 'Foobar.' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.approval_request.uuid[0].show().assert.should.equal('IsString');
      }
    }));

    it('should create an approval request', _asyncToGenerator(function* () {
      mocks.createApprovalRequest.succeed({
        request: {
          body: {
            api_key: '{key}',
            'details[Account Number]': '981266321',
            'details[location]': 'California, USA',
            'details[username]': 'Bill Smith',
            'hidden_details[ip_address]': '10.10.3.203',
            'logos[0][res]': 'default',
            'logos[0][url]': 'https://example.com/logos/default.png',
            'logos[1][res]': 'low',
            'logos[1][url]': 'https://example.com/logos/low.png',
            message: 'Login requested for a CapTrade Bank account.',
            seconds_to_expire: '120'
          }
        }
      });

      const approvalRequest = yield client.createApprovalRequest({
        authyId: 1635,
        details: {
          hidden: {
            ip_address: '10.10.3.203'
          },
          visible: {
            'Account Number': '981266321',
            location: 'California, USA',
            username: 'Bill Smith'
          }
        },
        logos: [{
          res: 'default',
          url: 'https://example.com/logos/default.png'
        }, {
          res: 'low',
          url: 'https://example.com/logos/low.png'
        }],
        message: 'Login requested for a CapTrade Bank account.'
      }, {
        ttl: 120
      });

      approvalRequest.should.have.keys('approval_request', 'success');
      approvalRequest.approval_request.should.have.keys('uuid');
    }));

    it('should accept a callback', done => {
      mocks.createApprovalRequest.succeed();

      client.createApprovalRequest({ authyId: 1635, message: 'Login requested for a CapTrade Bank account.' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('registerUser()', () => {
    it('should throw an error if `countryCode` is missing', _asyncToGenerator(function* () {
      try {
        yield client.registerUser();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `email` is missing', _asyncToGenerator(function* () {
      try {
        yield client.registerUser();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.email.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `phone` is missing', _asyncToGenerator(function* () {
      try {
        yield client.registerUser();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `email` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.registerUser({ email: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.email[0].show().assert.should.equal('Email');
      }
    }));

    it('should throw an error if `phone` invalid', _asyncToGenerator(function* () {
      try {
        yield client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: 'FOO' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.phone[0].show().assert.should.equal('Phone');
      }
    }));

    it('should throw an error if `countryCode` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.registerUser({ countryCode: '12345', email: 'foo@bar.com', phone: '123456789' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.countryCode[0].show().assert.should.equal('CountryOrCallingCode');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { success: true });

      try {
        yield client.registerUser({ countryCode: 'MX', email: 'foo@bar.com', phone: '044 55 1234 5678' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.user.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response.user` is missing required `id`', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { success: true, user: {} });

      try {
        yield client.registerUser({ countryCode: 'MX', email: 'foo@bar.com', phone: '044 55 1234 5678' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.user.id.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { message: 123, success: true, user: { id: 'foobar' } });

      try {
        yield client.registerUser({ countryCode: 'MX', email: 'foo@bar.com', phone: '044 55 1234 5678' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
        e.errors.user.id[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should support `countryCode` in the ISO 3166-1 alpha-2 format', _asyncToGenerator(function* () {
      mocks.registerUser.succeed({
        request: {
          body: {
            'user[cellphone]': '911234567',
            'user[country_code]': '351',
            'user[email]': 'foo@bar.com'
          }
        }
      });

      yield client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' });
    }));

    it('should return the authy user `id`', _asyncToGenerator(function* () {
      mocks.registerUser.succeed();

      const response = yield client.registerUser({ countryCode: 'MX', email: 'foo@bar.com', phone: '044 55 1234 5678' });

      response.user.id.should.equal(1635);
    }));

    it('should accept a callback', done => {
      mocks.registerUser.succeed();

      client.registerUser({ countryCode: 'MX', email: 'foo@bar.com', phone: '044 55 1234 5678' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('verifyToken()', () => {
    it('should throw an error if `authyId` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyToken();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `authyId` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyToken({ authyId: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `force` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyToken({ authyId: 1635, token: 'foobar' }, { force: 'yes' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.force[0].show().assert.should.equal('Boolean');
      }
    }));

    it('should throw an error if `token` is missing', _asyncToGenerator(function* () {
      try {
        yield client.verifyToken();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.token.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `token` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.verifyToken({ token: '../' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.token[0].show().assert.should.equal('TotpToken');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/.*/).reply(200, { success: true });

      try {
        yield client.verifyToken({ authyId: 1635, token: '1234567' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.token.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/.*/).reply(200, {
        message: 'foo',
        success: true,
        token: 'bar'
      });

      try {
        yield client.verifyToken({ authyId: 1635, token: '1234567' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
        e.errors.token[0].show().assert.should.equal('EqualTo');
      }
    }));

    it('should verify the token', _asyncToGenerator(function* () {
      mocks.verifyToken.succeed();

      const verifyToken = yield client.verifyToken({ authyId: 1635, token: '1234567' });

      verifyToken.should.have.keys('message', 'success', 'token');
    }));

    it('should support forcing the verification', _asyncToGenerator(function* () {
      mocks.verifyToken.succeedWithForce();

      yield client.verifyToken({ authyId: 1635, token: '1234567' }, { force: true });
    }));

    it('should accept a callback', done => {
      mocks.verifyToken.succeed();

      client.verifyToken({ authyId: 1635, token: '1234567' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('requestSms()', () => {
    it('should throw an error if `authyId` is missing', _asyncToGenerator(function* () {
      try {
        yield client.requestSms();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `authyId` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({ authyId: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `action` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { action: [] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.action[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `action` is too short', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { action: '' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.action[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `action` is too large', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { action: 'f'.repeat(256) });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.action[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `message` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { message: [] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `message` is too short', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { message: '' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `message` is too large', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { message: 'f'.repeat(256) });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `force` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestSms({}, { force: 'yes' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.force[0].show().assert.should.equal('Boolean');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.requestSms({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.cellphone.show().assert.should.equal('HaveProperty');
        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { cellphone: 123, device: 123, ignored: 123, message: 123, success: true });

      try {
        yield client.requestSms({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.cellphone[0].show().assert.should.equal('IsString');
        e.errors.device[0].show().assert.should.equal('IsString');
        e.errors.ignored[0].show().assert.should.equal('Boolean');
        e.errors.message[0].show().assert.should.equal('IsString');
      }
    }));

    it('should request an sms to be sent to the cellphone', _asyncToGenerator(function* () {
      mocks.requestSms.succeed();

      yield client.requestSms({ authyId: 1635 });
    }));

    it('should request an sms even if the request is ignored', _asyncToGenerator(function* () {
      mocks.requestSms.succeedWithSmsIgnored();

      yield client.requestSms({ authyId: 1635 });
    }));

    it('should support an action', _asyncToGenerator(function* () {
      mocks.requestSms.succeed({ request: { query: { action: 'foobar' } } });

      yield client.requestSms({ authyId: 1635 }, { action: 'foobar' });
    }));

    it('should support an action message', _asyncToGenerator(function* () {
      mocks.requestSms.succeed({ request: { query: { action_message: 'foobar' } } });

      yield client.requestSms({ authyId: 1635 }, { message: 'foobar' });
    }));

    it('should support forcing the sms', _asyncToGenerator(function* () {
      mocks.requestSms.succeedWithForce();

      yield client.requestSms({ authyId: 1635 }, { force: true });
    }));

    it('should accept a callback', done => {
      mocks.requestSms.succeed();

      client.requestSms({ authyId: 1635 }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('requestCall()', () => {
    it('should throw an error if `authyId` is missing', _asyncToGenerator(function* () {
      try {
        yield client.requestCall();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `authyId` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({ authyId: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `action` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { action: [] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.action[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `action` is too short', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { action: '' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.action[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `action` is too large', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { action: 'f'.repeat(256) });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.action[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `message` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { message: [] });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('IsString');
      }
    }));

    it('should throw an error if `message` is too short', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { message: '' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `message` is too large', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { message: 'f'.repeat(256) });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.message[0].show().assert.should.equal('Length');
      }
    }));

    it('should throw an error if `force` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.requestCall({}, { force: 'yes' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.force[0].show().assert.should.equal('Boolean');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.requestCall({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.cellphone.show().assert.should.equal('HaveProperty');
        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { cellphone: 123, device: 123, ignored: 123, message: 123, success: true });

      try {
        yield client.requestCall({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.cellphone[0].show().assert.should.equal('IsString');
        e.errors.device[0].show().assert.should.equal('IsString');
        e.errors.ignored[0].show().assert.should.equal('Boolean');
        e.errors.message[0].show().assert.should.equal('IsString');
      }
    }));

    it('should request call to the cellphone', _asyncToGenerator(function* () {
      mocks.requestCall.succeed();

      yield client.requestCall({ authyId: 1635 });
    }));

    it('should request a call even if the request is ignored', _asyncToGenerator(function* () {
      mocks.requestCall.succeedWithCallIgnored();

      yield client.requestCall({ authyId: 1635 });
    }));

    it('should support an action', _asyncToGenerator(function* () {
      mocks.requestCall.succeed({ request: { query: { action: 'foobar' } } });

      yield client.requestCall({ authyId: 1635 }, { action: 'foobar' });
    }));

    it('should support an action message', _asyncToGenerator(function* () {
      mocks.requestCall.succeed({ request: { query: { action_message: 'foobar' } } });

      yield client.requestCall({ authyId: 1635 }, { message: 'foobar' });
    }));

    it('should support forcing the call', _asyncToGenerator(function* () {
      mocks.requestCall.succeedWithForce();

      yield client.requestCall({ authyId: 1635 }, { force: true });
    }));

    it('should accept a callback', done => {
      mocks.requestCall.succeed();

      client.requestCall({ authyId: 1635 }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('deleteUser()', () => {
    it('should throw an error if `authyId` is missing', _asyncToGenerator(function* () {
      try {
        yield client.deleteUser();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `authyId` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.deleteUser({ authyId: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `ip` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.deleteUser({}, { ip: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ip[0].show().assert.should.equal('Ip');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { success: true });

      try {
        yield client.deleteUser({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { message: 'foo', success: true });

      try {
        yield client.deleteUser({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
      }
    }));

    it('should accept the `ip` of the requester', _asyncToGenerator(function* () {
      mocks.deleteUser.succeed({ request: { body: { user_ip: '127.0.0.1' } } });

      yield client.deleteUser({ authyId: 1635 }, { ip: '127.0.0.1' });
    }));

    it('should delete the user', _asyncToGenerator(function* () {
      mocks.deleteUser.succeed();

      const response = yield client.deleteUser({ authyId: 1635 });

      response.should.have.keys('message', 'success');
    }));

    it('should accept a callback', done => {
      mocks.deleteUser.succeed();

      client.deleteUser({ authyId: 1635 }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('getUserStatus()', () => {
    it('should throw an error if `authyId` is missing', _asyncToGenerator(function* () {
      try {
        yield client.getUserStatus();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `authyId` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.getUserStatus({ authyId: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `ip` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.getUserStatus({}, { ip: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ip[0].show().assert.should.equal('Ip');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.getUserStatus({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.status.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, {
        message: 123,
        status: {
          authy_id: 'foo',
          confirmed: 123,
          country_code: 'bar',
          devices: [123],
          has_hard_token: 'biz',
          phone_number: 123,
          registered: 123
        },
        success: true
      });

      try {
        yield client.getUserStatus({ authyId: 1635 });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
        e.errors.status.authy_id[0].show().assert.should.equal('AuthyId');
        e.errors.status.confirmed[0].show().assert.should.equal('Boolean');
        e.errors.status.country_code[0].show().assert.should.equal('CountryOrCallingCode');
        e.errors.status.has_hard_token[0].show().assert.should.equal('Boolean');
        e.errors.status.phone_number[0].show().assert.should.equal('IsString');
        e.errors.status.registered[0].show().assert.should.equal('Boolean');
      }
    }));

    it('should accept the `ip` of the requester', _asyncToGenerator(function* () {
      mocks.getUserStatus.succeed({ request: { body: { user_ip: '127.0.0.1' } } });

      yield client.getUserStatus({ authyId: 1635 }, { ip: '127.0.0.1' });
    }));

    it('should return the user status', _asyncToGenerator(function* () {
      mocks.getUserStatus.succeed();

      const response = yield client.getUserStatus({ authyId: 1635 });

      response.should.have.keys('message', 'status', 'success');
    }));

    it('should accept a callback', done => {
      mocks.getUserStatus.succeed();

      client.getUserStatus({ authyId: 1635 }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('getApplicationDetails()', () => {
    it('should throw an error if `ip` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.getApplicationDetails({ ip: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ip[0].show().assert.should.equal('Ip');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.getApplicationDetails();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.app.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, {
        app: {
          app_id: 'foo',
          name: 123,
          plan: 123,
          sms_enabled: 'bar'
        },
        message: 'foobar',
        success: true
      });

      try {
        yield client.getApplicationDetails();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
        e.errors.app.app_id[0].show().assert.should.equal('Integer');
        e.errors.app.name[0].show().assert.should.equal('IsString');
        e.errors.app.plan[0].show().assert.should.equal('IsString');
        e.errors.app.sms_enabled[0].show().assert.should.equal('Boolean');
      }
    }));

    it('should accept the `ip` of the requester', _asyncToGenerator(function* () {
      mocks.getApplicationDetails.succeed({ request: { query: { user_ip: '127.0.0.1' } } });

      yield client.getApplicationDetails({ ip: '127.0.0.1' });
    }));

    it('should return the application statistics', _asyncToGenerator(function* () {
      mocks.getApplicationDetails.succeed();

      const response = yield client.getApplicationDetails();

      response.should.have.keys('app', 'message', 'success');
    }));

    it('should accept a callback', done => {
      mocks.getApplicationDetails.succeed();

      client.getApplicationDetails((err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('registerActivity()', () => {
    ['authyId', 'type', 'ip'].forEach(parameter => {
      it(`should throw an error if \`${ parameter }\` is missing`, _asyncToGenerator(function* () {
        try {
          yield client.registerActivity();

          _should2.default.fail();
        } catch (e) {
          e.should.be.instanceOf(_errors.ValidationFailedError);
          e.errors[parameter].show().assert.should.equal('HaveProperty');
        }
      }));
    });

    it('should throw an error if `authyId` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.registerActivity({ authyId: '/' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.authyId[0].show().assert.should.equal('AuthyId');
      }
    }));

    it('should throw an error if `type` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.registerActivity({ type: 'kicked' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.type[0].show().assert.should.equal('Activity');
      }
    }));

    it('should throw an error if `ip` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.registerActivity({}, { ip: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ip[0].show().assert.should.equal('Ip');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { success: true });

      try {
        yield client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '86.112.56.34' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).post(/\//).reply(200, { cellphone: 123, device: 123, ignored: 123, message: 123, success: true });

      try {
        yield client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '86.112.56.34' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.message[0].show().assert.should.equal('EqualTo');
      }
    }));

    it('should register the activity', _asyncToGenerator(function* () {
      mocks.registerActivity.succeed({ request: { body: { 'data[reason]': 'foo', type: 'banned', user_ip: '86.112.56.34' } } });

      yield client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '86.112.56.34' });
    }));

    it('should accept a callback', done => {
      mocks.registerActivity.succeed();

      client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '86.112.56.34' }, (err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });

  describe('getApplicationStatistics()', () => {
    it('should throw an error if `ip` is invalid', _asyncToGenerator(function* () {
      try {
        yield client.getApplicationStatistics({ ip: 'foo' });

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.ValidationFailedError);
        e.errors.ip[0].show().assert.should.equal('Ip');
      }
    }));

    it('should throw an error if `response` is missing required fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, { success: true });

      try {
        yield client.getApplicationStatistics();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.app_id.show().assert.should.equal('HaveProperty');
        e.errors.count.show().assert.should.equal('HaveProperty');
        e.errors.message.show().assert.should.equal('HaveProperty');
        e.errors.stats.show().assert.should.equal('HaveProperty');
        e.errors.total_users.show().assert.should.equal('HaveProperty');
      }
    }));

    it('should throw an error if `response` contains invalid fields', _asyncToGenerator(function* () {
      (0, _nock2.default)(/authy/).get(/\//).reply(200, {
        app_id: 'foo',
        count: 'bar',
        message: 'biz',
        stats: [{}],
        success: true,
        total_users: 'net'
      });

      try {
        yield client.getApplicationStatistics();

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_errors.AssertionFailedError);

        e.errors.app_id[0].show().assert.should.equal('Integer');
        e.errors.count[0].show().assert.should.equal('Integer');
        e.errors.message[0].show().assert.should.equal('EqualTo');
        e.errors.stats[0]['0'].show().assert.should.equal('EqualKeys');
        e.errors.total_users[0].show().assert.should.equal('Integer');
      }
    }));

    it('should return the application statistics', _asyncToGenerator(function* () {
      mocks.getApplicationStatistics.succeed();

      const response = yield client.getApplicationStatistics();

      response.should.have.keys('app_id', 'count', 'message', 'total_users', 'stats', 'success');
      response.stats.should.matchEach(function (value) {
        return value.should.have.keys('api_calls_count', 'auths_count', 'calls_count', 'month', 'sms_count', 'users_count', 'year');
      });
    }));

    it('should accept the `ip` of the requester', _asyncToGenerator(function* () {
      mocks.getApplicationStatistics.succeed({ request: { query: { user_ip: '127.0.0.1' } } });

      yield client.getApplicationStatistics({ ip: '127.0.0.1' });
    }));

    it('should accept a callback', done => {
      mocks.getApplicationStatistics.succeed();

      client.getApplicationStatistics((err, response) => {
        _should2.default.not.exist(err);
        response.should.be.an.Object();

        done();
      });
    });
  });
});