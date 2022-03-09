import {
  readdirSync,
  mkdirSync,
  existsSync,
  rmdirSync,
} from 'fs';

import type {
  CollectOptions,
  CollectOutput,
} from '$commands/collect/collect.types';
import { generateJSON } from '$commands/collect/generators/json';
import { generateRouteUtil } from '$commands/collect/generators/route';

export function collect(options: CollectOptions): CollectOutput {
  const { outDir } = options;
  const output = {
    json: null,
    route: null,
  };
  try {
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    output.json = generateJSON(options);
    if (options.utils) {
      output.route = generateRouteUtil(options);
    }
  } catch (error) {
    console.error(error);
    const data = readdirSync(outDir);
    if (data.length === 0) {
      rmdirSync(outDir, { recursive: true });
    }
    throw error;
  }
  return output;
}
