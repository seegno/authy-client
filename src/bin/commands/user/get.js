
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('get'),
  command: 'get <command>',
  describe: 'View user information'
};
