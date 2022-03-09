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

import { defaultCollectOptions } from './collect.constants';

export function collect(options: Partial<CollectOptions> = {}): CollectOutput {
  const mergedOptions: CollectOptions = {
    ...defaultCollectOptions,
    ...options,
  };
  const { outDir, output } = options;
  const result = {
    json: null,
    route: null,
  };
  try {
    if (!existsSync(outDir) && output) {
      mkdirSync(outDir, { recursive: true });
    }
    result.json = generateJSON(mergedOptions);
    if (mergedOptions.utils) {
      result.route = generateRouteUtil(mergedOptions);
    }
  } catch (error) {
    console.error(error);
    if (existsSync(outDir) && readdirSync(outDir).length === 0) {
      rmdirSync(outDir, { recursive: true });
    }
    throw error;
  }
  return result;
}
