
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('commands'),
  command: 'get <command>',
  describe: 'View application information'
};
