
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('activity'),
  command: 'activity <command>',
  describe: 'Manage activity'
};
