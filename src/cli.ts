import { Command } from 'commander';

import { collectCli } from '$commands/collect/collect.cli';

const program = new Command();
program.addCommand(collectCli());
program.parse(process.argv);
