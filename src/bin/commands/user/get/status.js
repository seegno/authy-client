
/**
 * Module dependencies.
 */

import { Client } from '../../../../';
import handle from '../../../handler';

/**
 * Export command definition.
 */

export default {
  builder: yargs => {
    yargs
      .option('ip', {
        describe: 'The ip address of the user requesting to see the user details',
        type: 'string'
      });
  },
  command: 'status <authy-id>',
  describe: 'Retrieve the user status, such as the registered country code, phone number, available devices and confirmation status',
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.getUserStatus({ authyId: argv.authyId }, { ip: argv.ip });
  })
};
