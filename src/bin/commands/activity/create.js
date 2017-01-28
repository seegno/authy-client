
/**
 * Module dependencies.
 */

import handle from '../../handler';
import { isPlainObject } from 'lodash';
import { Client, enums } from '../../../';

/**
 * Export command definition.
 */

export default {
  builder: yargs => {
    yargs
      .option('data', { describe: 'A dictionary of data associated with the activity' })
      .coerce('data', data => {
        if (!isPlainObject(data)) {
          throw new Error('Hidden details should be called with --data.<key>=<value>\n\nExample: --data.foo=bar --data.biz=net');
        }

        return data;
      })
      .option('ip', {
        describe: 'The ip address of the user registering the activity',
        type: 'string'
      })
      .option('type', {
        choices: Object.values(enums.activity),
        describe: 'The activity type',
        required: true
      });
  },
  command: 'create <authy-id>',
  describe: 'Create activity',
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.registerActivity({
      authyId: argv.authyId,
      data: argv.data,
      type: argv.type
    }, {
      ip: argv.ip
    });
  })
};
