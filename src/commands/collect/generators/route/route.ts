import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { resolve } from 'path';

import { MAPPING_FILENAME } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';

export function generateRouteUtil(options: CollectOptions): string|null {
  const { output, outDir, typescript } = options;

  const ext = typescript ? '.ts' : '.js';

  /**
   * get the source in relative path to build target
   * see rollup.config.ts for more details
   */
  const source = readFileSync(resolve(__dirname, '../route.source' + ext), 'utf-8');

  const data =
`export { default as AppRoutes } from './${MAPPING_FILENAME}';
${source}
`;

  let file = null;
  if (output) {
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    file = resolve(outDir, 'index' + ext);
    writeFileSync( file, data, { encoding: 'utf-8' });
  } else {
    file = data;
  }

  return file;
}
