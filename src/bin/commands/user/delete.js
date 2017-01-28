
/**
 * Module dependencies.
 */

import { Client } from '../../../';
import handle from '../../handler';

/**
 * Export command definition.
 */

export default {
  builder: {},
  command: 'delete <authy-id>',
  describe: `Delete user`,
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.deleteUser({ id: argv.authyId });
  })
};
