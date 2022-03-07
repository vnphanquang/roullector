import {
  readdirSync,
  mkdirSync,
  existsSync,
  rmSync,
} from 'fs';

import type { CollectOptions } from '$commands/collect/collect.types';
import { generateJSON } from '$commands/collect/generators/json';
import { generateUtils } from '$commands/collect/generators/utils';

export function collect(options: CollectOptions) {
  const { outDir } = options;
  try {
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    generateJSON(options);
    options.utils && generateUtils(options);
  } catch (error) {
    console.error(error);
    const data = readdirSync(outDir);
    if (data.length === 0) {
      rmSync(outDir, { recursive: true });
    }
  }
}
