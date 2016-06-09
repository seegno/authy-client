'use strict';

var _phoneTokenAssert = require('../../src/asserts/phone-token-assert');

var _phoneTokenAssert2 = _interopRequireDefault(_phoneTokenAssert);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _validator = require('validator.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extend Assert with `PhoneToken`.
 */

const Assert = _validator.Assert.extend({ PhoneToken: _phoneTokenAssert2.default });

/**
 * Test `PhoneTokenAssert`.
 */

/**
 * Module dependencies.
 */

describe('PhoneTokenAssert', () => {
  it('should throw an error if the token is not a string', () => {
    [[], {}, 2].forEach(choice => {
      try {
        new Assert().PhoneToken().validate(choice);

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_validator.Violation);
        e.violation.value.should.equal('must_be_a_string');
      }
    });
  });

  it('should throw an error if the token is not numeric', () => {
    ['-10', '1.101', '1e6', new Array(50).join('foo')].forEach(value => {
      try {
        new Assert().PhoneToken().validate(value);

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_validator.Violation);
        e.violation.value.should.equal('must_be_numeric');
      }
    });
  });

  it('should throw an error if the token length is below the minimum boundary', () => {
    try {
      new Assert().PhoneToken().validate('10');

      _should2.default.fail();
    } catch (e) {
      e.should.be.instanceOf(_validator.Violation);
      e.violation.min.should.equal(4);
    }
  });

  it('should throw an error if the token length is above the maximum boundary', () => {
    ['1001001001', '000000009', '0000000010'].forEach(value => {
      try {
        new Assert().PhoneToken().validate(value);

        _should2.default.fail();
      } catch (e) {
        e.should.be.instanceOf(_validator.Violation);
        e.violation.max.should.equal(8);
      }
    });
  });

  it('should have default boundaries between 4 and 8 digits', () => {
    const assert = new Assert().PhoneToken();

    assert.boundaries.min.should.equal(4);
    assert.boundaries.max.should.equal(8);
  });

  it('should accept tokens between 4 and 8 digits', () => {
    ['1234', '0601338', '5166240', '12345678'].forEach(value => {
      new Assert().PhoneToken().validate(value);
    });
  });
});