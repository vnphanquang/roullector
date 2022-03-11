import {
  statSync,
  readdirSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
import {
  basename,
  join,
  resolve,
} from 'path';

import { MAPPING_FILENAME } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { compose } from '$utils/transformer';

export type DeepObject<T> = {
  [key: string]: T | DeepObject<T>;
};

export function extractRouteMapping(options: CollectOptions, inputDir: string = options.inDir, currentPath = '', level = 0): DeepObject<string> {
  const children = readdirSync(inputDir);

  const map: DeepObject<string> = {};

  if (level <= options.depth) {
    for (const child of children) {
      const absPath = join(inputDir, child);
      const stats = statSync(absPath);

      // skip if any ignore pattern matches
      const filename = basename(child);
      if (options.ignorePatterns.some(pattern => new RegExp(pattern).test(filename))) continue;

      if (stats.isDirectory()) {
        const nextPath = `${currentPath}/${child}`;
        const childMap = extractRouteMapping(options, absPath, nextPath, level + 1);
        if (Object.keys(childMap).length) {
          if (!childMap['index']) {
            childMap[options.dirkey] = nextPath;
          }
          const transformed = compose(child, ...options.keyTransform);
          map[transformed] = childMap;
        }
      } else {
        // skip if extension doesn't match
        if (options.extensions.every((ext) => !filename.endsWith(ext))) continue;

        // transform filename to route key
        const routeKey = filename.replace(/\.[^/.]+$/, ''); // trim extension
        const transformed = compose(routeKey, ...options.keyTransform);

        let routeName = routeKey;
        if (routeKey === 'index') {
          // no explicit `index`
          routeName = '';
        }
        let nextPath = currentPath;
        if (routeName) {
          nextPath += `/${routeName}`;
        }

        if (!nextPath && level === 0) {
          // root level index route
          nextPath = '/';
        }

        map[transformed] = nextPath;
      }
    }
  }

  return map;
}

export function generateJSON(options: CollectOptions): string|null {
  const { inDir, output, outDir } = options;
  let file = null;
  if (existsSync(inDir)) {
    const map = extractRouteMapping(options);
    const data = JSON.stringify(map, null, 2); // spacing level = 2

    if (output) {
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }
      file = resolve(outDir, MAPPING_FILENAME);
      writeFileSync( file, data, { encoding: 'utf-8' });
    } else {
      file = data;
    }
  }
  return file;
}
