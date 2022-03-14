import {
  readdirSync,
  mkdirSync,
  existsSync,
  rmdirSync,
  writeFileSync,
} from 'fs';
import { resolve } from 'path';

import type {
  CollectOptions,
  CollectOutput,
} from '$commands/collect/collect.types';
import { generateMapping } from '$commands/collect/generators/mapping';
import { generateRouteUtil } from '$commands/collect/generators/route';

import {
  defaultCollectOptions,
  MAPPING_FILENAME,
} from './collect.constants';

export function collect(options: Partial<CollectOptions> = {}): CollectOutput {
  const mergedOptions: CollectOptions = {
    ...defaultCollectOptions,
    ...options,
  };
  const { outDir, output, typescript } = options;
  const result = {
    json: null,
    route: null,
  };
  try {
    const { map } = generateMapping(mergedOptions);

    let json: CollectOutput['json'] = JSON.stringify(map, null, 2);
    let route: CollectOutput['route'] = mergedOptions ? generateRouteUtil(mergedOptions) : null;

    if (output) {
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      // write json
      let file = resolve(outDir, MAPPING_FILENAME);
      writeFileSync(file, json, { encoding: 'utf-8' });
      json = file;

      // write index
      const ext = typescript ? '.ts' : '.js';
      file = resolve(outDir, 'index' + ext);
      writeFileSync(file, route, { encoding: 'utf-8' });
      route = file;
    }

    result.json = json;
    result.route = route;
  } catch (error) {
    console.error(error);
    if (existsSync(outDir) && readdirSync(outDir).length === 0) {
      rmdirSync(outDir, { recursive: true });
    }
    throw error;
  }
  return result;
}
