import {
  vol,
  fs,
} from 'memfs';

import { defaultCollectOptions } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { generateMapping } from '$commands/collect/generators/mapping';
import { FILES } from '$tests/fixtures/memfs';

jest.mock('fs', () => fs);
beforeEach(() => {
  vol.fromNestedJSON(FILES, defaultCollectOptions.inDir);
});
afterEach(() => {
  vol.reset();
});

const generateMappingWithOptions = (snapshotToMatch: string, options: Partial<CollectOptions> = {}) => {
  const generated = generateMapping({
    ...defaultCollectOptions,
    ...options,
  });
  expect(generated).toMatchSnapshot(snapshotToMatch);
};

test(`generate JSON but empty directory`, () => {
  vol.reset();
  const outputPath = generateMapping(defaultCollectOptions);
  expect(outputPath).toBe(null);
});

test(`generate mapping with default options`, () => {
  generateMappingWithOptions('generateMapping: default');
});

test(`generate mapping with a custom extension matcher`, () => {
  generateMappingWithOptions('generateMapping: custom extension matcher', { extensions: ['.ts'] });
});

test(`generate mapping with depth of 1`, () => {
  generateMappingWithOptions('generateMapping: depth 1', { depth: 1 });
});

const ignorePatterns = ['^_', '^posts'];
test(`generate mapping with custom ignorePatterns: ${ignorePatterns}`, () => {
  generateMappingWithOptions('generateMapping: custom ignorePatterns',{ ignorePatterns });
});

const dirkey = '__customDir__';
test(`generate Mapping with custom dirkey: ${dirkey}`, () => {
  generateMappingWithOptions('generateMapping: custom dirkey', { dirkey });
});
