import type {
  CollectOptions,
  KeyTransformFn
} from '$commands/collect/collect.types';
import {KeyTransformCli} from '$commands/collect/collect.types';
import {
  camelCasify,
  dollarArgify,
} from '$utils/transformer';

export const MAPPING_FILENAME = 'routes.json';
export const UTIL_ROUTE_FILENAME = 'route';

export const defaultCollectOptions: CollectOptions = {
  inDir: 'src/routes',
  extensions: ['.svelte'],
  ignorePatterns: [/^_/],
  output: true,
  outDir: 'src/generated/routing',
  typescript: true,
  keyTransform: [dollarArgify, camelCasify],
  verbose: false,
  depth: Infinity,
  dirkey: '__dir',
  utils: true,
};

export const defaultKeyTransformCli: KeyTransformCli[] = [
  KeyTransformCli.camelCase,
  KeyTransformCli.dollarArg,
];

export const keyTransformCliToFunc: Record<KeyTransformCli, KeyTransformFn> = {
  none: (str) => str,
  camelCase: camelCasify,
  dollarArg: dollarArgify,
};
