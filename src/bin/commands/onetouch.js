
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('onetouch'),
  command: 'onetouch <command>',
  describe: 'Manage onetouch requests'
};
