
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('application'),
  command: 'application <command>',
  describe: 'Manage application information'
};
