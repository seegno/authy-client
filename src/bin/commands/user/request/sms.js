
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
      .option('action', {
        describe: 'The action or context of the request',
        type: 'string'
      })
      .option('action-message', {
        describe: 'A message for the specific action, if one is set',
        type: 'string'
      })
      .option('force', {
        describe: 'Whether to send an sms even if the user is using the mobile application',
        type: 'boolean'
      });
  },
  command: 'sms <authy-id>',
  describe: `Request token via sms. If the Authy app is in use by the user, this request is ignored and a push notification is sent instead, unless --force is specified`,
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.requestSms({ authyId: argv.authyId }, { action: argv.action, force: argv.force, message: argv.actionMessage });
  })
};
