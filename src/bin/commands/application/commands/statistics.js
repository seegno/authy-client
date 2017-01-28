
/**
 * Module dependencies.
 */

import { Client } from '../../../../';
import handle from '../../../handler';

/**
 * Export command definition.
 */

export default {
  command: 'statistics',
  describe: 'Show application statistics',
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.getApplicationStatistics();
  })
};
