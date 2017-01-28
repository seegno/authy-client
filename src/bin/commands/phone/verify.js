
/**
 * Module dependencies.
 */

import handle from '../../handler';
import { Client, enums } from '../../../';

/**
 * Export command definition.
 */

export default {
  builder: yargs => {
    yargs
      .option('locale', {
        choices: Object.values(enums.locale),
        default: enums.locale.ENGLISH,
        describe: 'Locale'
      })
      .coerce('phone', phone => String(phone))
      .option('token', {
        describe: 'Token',
        type: 'string'
      })
      .option('via', {
        choices: [enums.verificationVia.CALL, enums.verificationVia.SMS],
        default: enums.verificationVia.SMS,
        describe: 'Via'
      });
  },
  command: 'verify <phone> <country-code>',
  describe: 'Verify phone using token',
  handler: handle(async argv => {
    const client = new Client({ key: argv.key });

    if (argv.token) {
      return await client.verifyPhone({
        countryCode: argv.countryCode,
        phone: argv.phone,
        token: argv.token
      });
    }

    return await client.startPhoneVerification({
      countryCode: argv.countryCode,
      phone: argv.phone,
      via: argv.via
    }, {
      locale: argv.locale
    });
  })
};
