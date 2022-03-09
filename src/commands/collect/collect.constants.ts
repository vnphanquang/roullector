import type {
  CliCollectOptions,
  CollectOptions,
} from '$commands/collect/collect.types';

export const MAPPING_FILENAME = 'routes.json';
export const UTIL_ROUTE_FILENAME = 'route';

export function camelCasify(str: string) {
  return str
    .trim()
    .replace(/\[([a-zA-Z_-]+)\]/g, function(match, p1) {
      return match.replace(/\[[a-zA-Z_-]+\]/g, `-${p1}`);
    })
    .replace(/[-_\s]+./g, function(match) {
      return match.replace(/[-_\s]/g, '').toUpperCase();
    })
    .replace(/^(.)/, function(match) {
      return match.toLowerCase();
    });
}

export const defaultCollectOptions: CollectOptions = {
  inDir: 'src/routes',
  extensions: ['.svelte'],
  ignorePatterns: [/^_/],
  output: true,
  outDir: 'src/generated/routing',
  typescript: true,
  keyTransform: camelCasify,
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
  camelCase: camelCasify,
  none: (str) => str,
};
