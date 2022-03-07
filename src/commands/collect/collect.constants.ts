import type {
  CliCollectOptions,
  CollectOptions,
} from './collect.types';

export function CamelCasify(str: string) {
  return str
    .trim()
    .replace(/([-_\s]+.)/g, function($1) {
      return $1.replace(/[-_\s]/g, '').toUpperCase();
    })
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
}

export const defaultCollectOptions: CollectOptions = {
  inDir: 'src/routes',
  extensions: ['.svelte'],
  ignorePatterns: ['^_'],
  outDir: 'src/generated/routing',
  typescript: true,
  keyTransform: CamelCasify,
  verbose: false,
  depth: Infinity,
  dirkey: '__dir',
  utils: true,
};

export const defaultCliCollectOptions: CliCollectOptions = {
  ...defaultCollectOptions,
  extensions: defaultCollectOptions.extensions.join(','),
  ignorePatterns: defaultCollectOptions.ignorePatterns.map((pattern) => (pattern instanceof RegExp) ? pattern.source : pattern).join(','),
  depth: 'Infinity',
  keyTransform: 'camelCase',
};

export const keyTransformCliToFunc: Record<CliCollectOptions['keyTransform'], (str) => string> = {
  camelCase: CamelCasify,
};
