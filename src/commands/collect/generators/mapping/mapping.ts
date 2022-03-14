import {
  statSync,
  readdirSync,
  existsSync,
} from 'fs';
import {
  basename,
  join,
} from 'path';

import type { CollectOptions } from '$commands/collect/collect.types';
import { compose } from '$utils/transformer';

export type DeepObject<T> = {
  [key: string]: T | DeepObject<T>;
};

export function generateMapping(options: CollectOptions, inDir: string = options.inDir, currentPath = '', level = 0): {
  map: DeepObject<string>;
  array: string[];
} | null {
  if (!existsSync(inDir)) return null;

  const children = readdirSync(inDir);

  const map: DeepObject<string> = {};
  const array: string[] = [];

  if (level <= options.depth) {
    for (const child of children) {
      const absPath = join(inDir, child);
      const stats = statSync(absPath);

      // skip if any ignore pattern matches
      const filename = basename(child);
      console.info(`Turbo ~ file: mapping.ts ~ line 36 ~ generateMapping ~ filename`, filename);
      if (options.ignorePatterns.some(pattern => new RegExp(pattern).test(filename))) continue;

      if (stats.isDirectory()) {
        const nextPath = `${currentPath}/${child}`;
        const { map: childMap, array: childArray } = generateMapping(options, absPath, nextPath, level + 1);
        if (Object.keys(childMap).length) {
          if (!childMap['index']) {
            childMap[options.dirkey] = nextPath;
          }
          const transformed = compose(child, ...options.keyTransform);
          map[transformed] = childMap;
          array.push(...childArray);
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
        array.push(nextPath);
      }
    }
  }

  return { map, array };
}
