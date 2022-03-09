import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { resolve } from 'path';

import { transpile } from 'typescript';

import { MAPPING_FILENAME } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';

export function generateRouteUtil(options: CollectOptions): string|null {
  const { output, outDir, typescript } = options;
  let data = '';

  const ts = readFileSync(resolve(__dirname, './source.ts'), 'utf-8');

  if (typescript) {
    data =
`export { default as AppRoutes } from './${MAPPING_FILENAME}';
${ts}
`;
  } else {
    const js = transpile(ts);
    data =
`export { default as AppRoutes } from './${MAPPING_FILENAME}';
}
${js}
`;
  }

  let file = null;
  if (output) {
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    file = resolve(outDir, 'index.' + (typescript ? 'ts' : 'js'));
    writeFileSync( file, data, { encoding: 'utf-8' });
  } else {
    file = data;
  }

  return file;
}
