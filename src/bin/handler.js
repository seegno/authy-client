/* eslint-disable no-console */

import prettyjson from 'prettyjson';

/**
 * Export wrapping function.
 */

export default fn => {
  return argv => {
    (async () => {
      let result;

      try {
        result = await fn(argv);
      } catch (e) {
        result = JSON.parse(JSON.stringify(e));
      }

      if (argv.pretty) {
        return console.log(prettyjson.render(result));
      }

      return console.log(require('util').inspect(result, false, 10));
    })();
  };
};
