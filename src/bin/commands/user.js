
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('user'),
  command: 'user <command>',
  describe: 'Manage users'
};
