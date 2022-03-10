import {
  Command,
  InvalidArgumentError,
  Option,
} from 'commander';

import { collect } from '$commands/collect/collect';
import {
  keyTransformCliToFunc,
  defaultCollectOptions,
  defaultKeyTransformCli,
} from '$commands/collect/collect.constants';
import type {
  CollectOptions,
  KeyTransformFn,
} from '$commands/collect/collect.types';
import { KeyTransformCli } from '$commands/collect/collect.types';
import {
  commaSeparatedList,
  number,
} from '$utils/parser';

export function collectCli() {
  return new Command('collect')
    .description('collect route data')
    .option(
      '-i, --inDir <path>',
      'directory path to collect',
      defaultCollectOptions.inDir
    )
    .option(
      '-e, --extensions <list>',
      'comma-separated list of file extensions to collect',
      commaSeparatedList,
      defaultCollectOptions.extensions,
    )
    .option(
      '-x, --ignorePatterns <list>',
      'comma-separated list of filename patterns (string literal or regex) to ignore',
      commaSeparatedList,
      defaultCollectOptions.ignorePatterns,
    )
    .option(
      '--no-output',
      'don\'t write to disk but print to console instead',
      defaultCollectOptions.output,
    )
    .option(
      '-o, --outDir <path>',
      'outputs generated files to this folder',
      defaultCollectOptions.outDir,
    )
    .option(
      '-d, --depth <number>',
      'depth of inDir to collect',
      number,
      defaultCollectOptions.depth,
    )
    .addOption(
      new Option( '-t, --keyTransform <variant>', 'how to transform route key')
        .default([])
        .argParser<KeyTransformFn[]>((value, previous) => {
          if (!(value in KeyTransformCli)) {
            throw new InvalidArgumentError(`Must be one of: ${Object.keys(KeyTransformCli).join(', ')}`);
          }
          const valued = keyTransformCliToFunc[KeyTransformCli[value] as KeyTransformCli];
          return [...previous, valued];
        }),
    )
    .option(
      '-k, --dirkey <name>',
      'how to transform route key',
      defaultCollectOptions.dirkey,
    )
    .option(
      '--no-utils',
      'don\'t generate utils for building path with arguments',
      defaultCollectOptions.utils,
    )
    .option(
      '--no-typescript',
      'outputs files in javascript instead of typescript',
      defaultCollectOptions.typescript,
    )
    .option(
      '--verbose',
      'prints more info during operation',
      defaultCollectOptions.verbose,
    )
    .action((options: CollectOptions) => {
      if (options.keyTransform.length === 0) {
        options.keyTransform = defaultKeyTransformCli.map((k) => keyTransformCliToFunc[k]);
      }
      if (options.verbose) {
        console.info('Running "collect" with options:');
        console.table(Object.fromEntries(
          Object.entries(options).map(
            ([key, value]) => ([
              key,
              { value },
            ])
          )),
        );
      }

      const output = collect(options);
      if (!options.output) {
        console.log(output);
      }
    });
}
