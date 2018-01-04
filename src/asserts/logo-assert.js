
/**
 * Module dependencies.
 */

import * as asserts from 'validator.js-asserts';
import { Assert as BaseAssert, Violation } from 'validator.js';
import { pick, values } from 'lodash';
import { resolution } from '../enums';

/**
 * Inject `Uri` and `EqualKeys` extra asserts.
 */

const is = BaseAssert.extend(pick(asserts, ['Uri', 'EqualKeys']));

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
      is.equalKeys(['res', 'url']).validate(value);
      is.choice(choices).validate(value.res);
      is.uri().validate(value.url);
    } catch (e) {
      throw new Violation(e.assert, value, e.violation);
    }

    return true;
  };

  return this;
}
