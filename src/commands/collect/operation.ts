// import { statSync } from 'fs';
// import { dirname } from 'path';

import { sync as globSync } from 'glob';

import type { CollectOptions } from './types';

export type DeepObject<T> = {
  [key: string]: T | DeepObject<T>;
};

export function generateJSON(pattern: string) {
  const files = globSync(pattern);
  for (const file of files) {
    console.log(file);
  }
}

// export function generateUtils() {

// }

export function operation(options: CollectOptions) {
  const { pattern } = options;
  generateJSON(pattern);
}
