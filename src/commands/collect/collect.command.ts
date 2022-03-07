import {
  statSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
} from 'fs';
import {
  basename,
  join,
  resolve,
} from 'path';

import type { CollectOptions } from './collect.types';

export type DeepObject<T> = {
  [key: string]: T | DeepObject<T>;
};

function extractRouteMapping(options: CollectOptions, inputDir: string = options.inDir, currentPath = '', level = 0): DeepObject<string> {
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
          map[options.keyTransform(child)] = childMap;
        }
      } else {
        // skip if extension doesn't match
        if (options.extensions.every((ext) => !filename.endsWith(ext))) continue;

        // transform filename to route key
        let routeKey = filename.replace(/\.[^/.]+$/, ''); // trim extension
        routeKey = options.keyTransform(routeKey); // by default camelCase-ify key

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

        map[routeKey] = nextPath;
      }
    }
  }

  return map;
}

export function generateJSON(options: CollectOptions) {
  const map = extractRouteMapping(options);
  const outputPath = resolve(options.outDir, 'routes.json');
  writeFileSync(
    outputPath,
    JSON.stringify(map, null, 2), // spacing level = 2
    { encoding: 'utf-8' },
  );
}

// export function generateUtils() {

// }

export function collect(options: CollectOptions) {
  const { outDir } = options;
  try {
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    generateJSON(options);
  } catch (error) {
    console.error(error);
    const data = readdirSync(outDir);
    if (data.length === 0) {
      rmSync(outDir, { recursive: true });
    }
  }
}
