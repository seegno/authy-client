
/**
 * Module dependencies.
 */

import * as asserts from 'validator.js-asserts';
import { resolution } from '../enums';
import { Assert as BaseAssert, Violation } from 'validator.js';
import { pick, values } from 'lodash';

/**
 * Inject `Uri` and `EqualKeys` extra asserts.
 */

const Assert = BaseAssert.extend(pick(asserts, ['Uri', 'EqualKeys']));

/**
 * Resolution choices.
 */

const choices = values(resolution);

/**
 * Export `LogoAssert`.
 */

export default function logoAssert() {
  // Class name.
  this.__class__ = 'Logo';

  // Validation algorithm.
  this.validate = value => {
    try {
      new Assert().EqualKeys(['res', 'url']).validate(value);
      new Assert().Choice(choices).validate(value.res);
      new Assert().Uri().validate(value.url);
    } catch (e) {
      throw new Violation(e.assert, value, e.violation);
    }

    return true;
  };

  return this;
}
