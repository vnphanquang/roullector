import {
  readdirSync,
  mkdirSync,
  existsSync,
  rmSync,
} from 'fs';

import type { CollectOptions } from '$commands/collect/collect.types';
import { generateJSON } from '$commands/collect/generators/json';
import { generateRouteUtil } from '$commands/collect/generators/route';

export function collect(options: CollectOptions) {
  const { outDir } = options;
  try {
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    generateJSON(options);
    options.utils && generateRouteUtil(options);
  } catch (error) {
    console.error(error);
    const data = readdirSync(outDir);
    if (data.length === 0) {
      rmSync(outDir, { recursive: true });
    }
  }
}
