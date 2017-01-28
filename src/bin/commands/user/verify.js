/**
 * Module dependencies.
 */

import { Client } from '../../../';
import handle from '../../handler';

/**
 * Export command definition.
 */

export default {
  builder: yargs => {
    yargs
      .option('token', {
        describe: 'The token to verify',
        type: 'string'
      })
      .option('force', {
        describe: `Whether to verify the token regardless of the user's login status`,
        type: 'boolean'
      });
  },
  command: 'verify <authy-id>',
  describe: `Verify whether the token submitted by the user is valid`,
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.verifyToken({ authyId: argv.authyId, token: argv.token }, { force: argv.force });
  })
};
