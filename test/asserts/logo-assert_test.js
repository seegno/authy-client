
/**
 * Module dependencies.
 */

import Logo from '../../src/asserts/logo-assert';
import { resolution } from '../../src/enums';
import should from 'should';
import { values } from 'lodash';
import { Assert as BaseAssert, Violation } from 'validator.js';

/**
 * Extend Assert with `Logo`.
 */

const Assert = BaseAssert.extend({ Logo });

/**
 * Test `LogoAssert`.
 */

describe('LogoAssert', () => {
  it('should throw an error if the logo is not a plain object', () => {
    [[], 'foo', 123].forEach(logo => {
      try {
        new Assert().Logo().validate(logo);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.value.should.equal('must_be_a_plain_object');
      }
    });
  });

  it('should throw an error if the logo does not include a resolution', () => {
    try {
      new Assert().Logo().validate({ url: 'https://foo.bar' });

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('EqualKeys');
      e.show().violation.difference.should.eql(['res']);
    }
  });

  it('should throw an error if the logo does not include an url', () => {
    try {
      new Assert().Logo().validate({ res: resolution.DEFAULT });

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('EqualKeys');
      e.show().violation.difference.should.eql(['url']);
    }
  });

  it('should throw an error if the logo resolution is invalid', () => {
    try {
      new Assert().Logo().validate({ res: 'foobar', url: 'https://foo.bar' });

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('Choice');
      e.show().violation.choices.should.eql(values(resolution));
    }
  });

  it('should throw an error if the logo url is invalid', () => {
    try {
      new Assert().Logo().validate({ res: resolution.DEFAULT, url: 'https:/foo.bar' });

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('Uri');
    }
  });

  it('should accept a valid logo', () => {
    new Assert().Logo().validate({ res: resolution.DEFAULT, url: 'https://foo.bar' });
  });
});
