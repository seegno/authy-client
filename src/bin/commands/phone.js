
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('phone'),
  command: 'phone <command>',
  describe: 'Manage phone verifications'
};
