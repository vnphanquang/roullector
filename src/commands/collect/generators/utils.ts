/* eslint-disable no-useless-escape */
import {
  writeFileSync,
  readFileSync,
} from 'fs';
import { resolve } from 'path';

import { transpile } from 'typescript';

import type { CollectOptions } from '$commands/collect/collect.types';

export function generateUtils(options: CollectOptions) {
  const { outDir, typescript } = options;
  let source = '';

  const ts = readFileSync(resolve(__dirname, './route.ts'), 'utf-8');

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

  writeFileSync(
    outputPath,
    source,
    { encoding: 'utf-8' },
  );
}
