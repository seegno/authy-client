
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('commands'),
  command: 'get <command>',
  describe: 'View approval request information'
};
