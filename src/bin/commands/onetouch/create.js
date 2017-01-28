
/**
 * Module dependencies.
 */

import { Client } from '../../../';
import handle from '../../handler';
import { isPlainObject } from 'lodash';

/**
 * Export command definition.
 */

export default {
  builder: yargs => {
    yargs
      .option('logos', { describe: 'The custom logos collection' })
      .coerce('logos', logos => {
        if (!isPlainObject(logos)) {
          throw new Error('Logos should be called with --logos.<index>.res=<resolution> --logos.<index>.url=<url>\n\nExample: --logos.0.res=high --logos.0.url=https://foobar.com');
        }

        return Object.values(logos);
      })
      .option('hidden', { describe: 'A dictionary of hidden details associated with the approval request' })
      .coerce('hidden', logos => {
        if (!isPlainObject(logos)) {
          throw new Error('Hidden details should be called with --hidden.<key>=<value>\n\nExample: --hidden.foo=bar --hidden.biz=net');
        }

        return logos;
      })
      .option('visible', { describe: 'A dictionary of visible details associated with the approval request' })
      .coerce('visible', logos => {
        if (!isPlainObject(logos)) {
          throw new Error('Visible details should be called with --visible.<key>=<value>\n\nExample: --visible.foo=bar --visible.biz=net');
        }

        return logos;
      })
      .option('ttl', {
        describe: `The number of seconds that the approval request will be available for being responded. If set to 0, the approval request won't expire`,
        type: 'number'
      });
  },
  command: 'create <authy-id> <message>',
  describe: 'Create approval request',
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.createApprovalRequest({
      authyId: argv.authyId,
      details: {
        hidden: argv.hidden,
        visible: argv.visible
      },
      logos: argv.logos,
      message: argv.message
    }, {
      ttl: argv.ttl
    });
  })
};
