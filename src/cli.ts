import { Command } from 'commander';

import { collect } from '$commands/collect';

const program = new Command();
program.addCommand(collect());
program.parse(process.argv);
