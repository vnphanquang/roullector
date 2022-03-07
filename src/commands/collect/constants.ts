import type { CollectOptions } from './types';

export const defaultCollectOptions: CollectOptions = {
  pattern: 'src/routes',
  outDir: 'src/generated/routing',
  typescript: true,
};
