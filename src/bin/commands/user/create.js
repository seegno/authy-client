
/**
 * Module dependencies.
 */

import { Client } from '../../../';
import handle from '../../handler';

/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.coerce('phone', phone => String(phone)),
  command: 'create <phone> <country-code> <email>',
  describe: `Create user with <phone>`,
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    return await client.registerUser({ countryCode: argv.countryCode, email: argv.email, phone: argv.phone });
  })
};
