import { Command } from 'commander';

import { defaultCollectOptions } from './constants';
import type { CollectOptions } from './types';

export function collect() {
  return new Command('collect')
    .description('collect route data')
    .option(
      '-p, --pattern <type>',
      'glob pattern to search for files',
      defaultCollectOptions.pattern
    )
    .option(
      '-o, --outDir <type>',
      'outputs generated files to this folder',
      defaultCollectOptions.outDir
    )
    .option(
      '-t, --typescript',
      'outputs generated files in typescript',
      defaultCollectOptions.typescript
    )
    .action((rawOptions: CollectOptions) => {
      const options = {
        ...defaultCollectOptions,
        ...rawOptions,
      };
    });
}
