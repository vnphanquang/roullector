import { readFileSync } from 'fs';
import { resolve } from 'path';

import { MAPPING_FILENAME } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';

export function generateRouteUtil(options: CollectOptions): string|null {
  const { typescript } = options;

  const ext = typescript ? '.ts' : '.js';

  /**
   * get the source in relative path to build target
   * see rollup.config.ts for more details
   */
  const source = readFileSync(resolve(__dirname, '../route.source' + ext), 'utf-8');

  const generated =
`export { default as AppRoutes } from './${MAPPING_FILENAME}';
${source}
`;

  return generated;
}
