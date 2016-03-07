
/**
 * Module dependencies.
 */

import Activity from '../../src/asserts/activity-assert';
import should from 'should';
import { Assert as BaseAssert, Violation } from 'validator.js';
import { activity } from '../../src/enums';
import { values } from 'lodash';

/**
 * Extend Assert with `Activity`.
 */

const Assert = BaseAssert.extend({ Activity });

/**
 * Test `ActivityAssert`.
 */

describe('ActivityAssert', () => {
  it('should throw an error if the activity is not a string', () => {
    [[], {}, 123].forEach(activity => {
      try {
        new Assert().Activity().validate(activity);

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(Violation);
        e.violation.value.should.equal('must_be_a_string');
      }
    });
  });

  it('should throw an error if the activity is invalid', () => {
    try {
      new Assert().Activity().validate('foobar');

      should.fail();
    } catch (e) {
      e.should.be.instanceOf(Violation);
      e.show().assert.should.equal('Activity');
      e.show().violation.choices.should.eql(values(activity));
    }
  });

  it('should accept a valid activity', () => {
    new Assert().Activity().validate(activity.BANNED);
  });
});
