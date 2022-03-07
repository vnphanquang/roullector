/* eslint-disable no-useless-escape */
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import type { CollectOptions } from '$commands/collect/collect.types';

export function generateUtils(options: CollectOptions) {
  const { outDir, typescript } = options;
  let source = '';
  if (typescript) {
    source =
`export { default as AppRoutes } from './routes.json';

/**
 * build a complete path with injected arguments
 * @param path {string} based path
 * @param args {string[]} arguments to inject
 */
export function route(path: string, ...args: string[]): string {
  const params = path.match(/\[[a-zA-Z]+\]/g) ?? [];
  for (const i in params) {
    path = path.replace(params[i], args[i]);
  }
  return path;
}

`;
  } else {
    source =
`export { default as AppRoutes } from './routes.json';

/**
 * build a complete path with injected arguments
 * @param path {string} based path
 * @param args {string[]} arguments to inject
 */
export function route(path, ...args) {
  const params = path.match(/\[[a-zA-Z]+\]/g) ?? [];
  for (const i in params) {
    path = path.replace(params[i], args[i]);
  }
  return path;
}

`;
  }

  const outputPath = resolve(outDir, 'index.' + (typescript ? 'ts' : 'js'));

  writeFileSync(
    outputPath,
    source,
    { encoding: 'utf-8' },
  );
}
