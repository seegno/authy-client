#!/usr/bin/env node

import yargs from 'yargs';

/* eslint-disable no-unused-expressions */
yargs.commandDir('commands')
  .demandCommand(1)
  .env('AUTHY')
  .option('key', { demand: true, describe: 'API Key', type: 'string' })
  .option('pretty', { default: true, demand: false, describe: 'Whether to print pretty results', type: 'boolean' })
  .global('key')
  .global('pretty')
  .help()
  .argv;
