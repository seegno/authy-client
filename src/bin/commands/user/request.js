
/**
 * Export command definition.
 */

export default {
  builder: yargs => yargs.commandDir('request'),
  command: 'request <command>',
  describe: 'Request user token'
};
