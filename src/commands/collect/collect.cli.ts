import {
  Command,
  Option,
} from 'commander';

import { collect } from './collect.command';
import {
  defaultCliCollectOptions,
  keyTransformCliToFunc,
} from './collect.constants';
import type {
  CollectOptions,
  CliCollectOptions,
} from './collect.types';

export function collectCli() {
  return new Command('collect')
    .description('collect route data')
    .option(
      '-i, --inDir <path>',
      'directory path to collect',
      defaultCliCollectOptions.inDir
    )
    .option(
      '-e, --extensions <list>',
      'comma-separated list of file extensions to collect',
      defaultCliCollectOptions.extensions,
    )
    .option(
      '-x, --ignorePatterns <list>',
      'comma-separated list of filename patterns (string literal or regex) to ignore',
      defaultCliCollectOptions.ignorePatterns,
    )
    .option(
      '-o, --outDir <path>',
      'outputs generated files to this folder',
      defaultCliCollectOptions.outDir,
    )
    .option(
      '-d, --depth <number>',
      'depth of inDir to collect',
      defaultCliCollectOptions.depth,
    )
    .addOption(
      new Option( '-k, --keyTransform <variant>', 'how to transform route key')
        .choices(['camelCase'])
        .default(defaultCliCollectOptions.keyTransform)
    )
    .option(
      '-k, --dirkey <name>',
      'how to transform route key',
      defaultCliCollectOptions.dirkey,
    )
    .option(
      'u, --utils',
      'how to generate utils for building path with arguments',
      defaultCliCollectOptions.utils,
    )
    .option(
      '-u, --typescript',
      'outputs util files in typescript',
      defaultCliCollectOptions.typescript,
    )
    .option(
      '--verbose',
      'prints more info during operation',
      defaultCliCollectOptions.verbose,
    )
    .action((rawOptions: CliCollectOptions) => {
      const options: CollectOptions = {
        ...rawOptions,
        extensions: rawOptions.extensions?.split(',') ?? [],
        ignorePatterns: rawOptions.ignorePatterns?.split(',') ?? [],
        depth: Number(rawOptions.depth) || Infinity,
        keyTransform: keyTransformCliToFunc[rawOptions.keyTransform],
      };
      if (options.verbose) {
        console.info('Running "collect" with options:');
        console.table(Object.fromEntries(
          Object.entries(rawOptions).map(
            ([key, value]) => ([
              key,
              { value },
            ])
          )),
        );
      }

      collect(options);
    });
}
