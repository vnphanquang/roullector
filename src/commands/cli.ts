import { Command } from 'commander';

import { collectCli } from '$commands/collect/collect.cli';

import {
  version,
  name,
  description,
} from '$pkg';

export function cli() {
  return new Command()
  .name(name)
  .description(description)
  .version(version)
  .addCommand(collectCli());
}


