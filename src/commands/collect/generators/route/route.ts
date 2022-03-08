import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { resolve } from 'path';

import { transpile } from 'typescript';

import type { CollectOptions } from '$commands/collect/collect.types';

export function generateRouteUtil(options: CollectOptions) {
  const { outDir, typescript } = options;
  let source = '';

  const ts = readFileSync(resolve(__dirname, './source.ts'), 'utf-8');

  if (typescript) {
    source =
`export { default as AppRoutes } from './routes.json';
${ts}
`;
  } else {
    const js = transpile(ts);
    source =
`export { default as AppRoutes } from './routes.json';
}
${js}
`;
  }

  const outputPath = resolve(outDir, 'index.' + (typescript ? 'ts' : 'js'));

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(
    outputPath,
    source,
    { encoding: 'utf-8' },
  );

  return outputPath;
}
