
/**
 * Module dependencies.
 */

import debugnyan from 'debugnyan';
import request from './serializers/request-serializer';

debugnyan('authy', {
  serializers: {
    request
  }
});

export default debugnyan;
