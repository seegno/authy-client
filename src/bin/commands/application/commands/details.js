
/**
 * Module dependencies.
 */

import { Client } from '../../../../';
import handle from '../../../handler';

/**
 * Export command definition.
 */

export default {
  command: 'details',
  describe: 'Show application details',
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.getApplicationDetails();
  })
};
