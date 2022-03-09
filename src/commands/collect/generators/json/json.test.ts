import {
  vol,
  fs,
} from 'memfs';

import { defaultCollectOptions } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { generateJSON } from '$commands/collect/generators/json';
import { FILES } from '$tests/fixtures/memfs';

jest.mock('fs', () => fs);

const defaultOptions: CollectOptions = defaultCollectOptions;

beforeEach(() => {
  vol.fromNestedJSON(FILES, defaultCollectOptions.inDir);
});

afterEach(() => {
  vol.reset();
});

const generateJSONWithOptions = (snapshotToMatch: string, options: Partial<CollectOptions> = {}) => {
  const outputPath = generateJSON({
    ...defaultOptions,
    ...options,
  });
  const generated = fs.readFileSync(outputPath, 'utf-8');
  expect(generated).toMatchSnapshot(snapshotToMatch);
};

test(`generate JSON but empty directory`, () => {
  vol.reset();
  const outputPath = generateJSON(defaultOptions);
  expect(outputPath).toBe(null);
});

test(`generate JSON with default options`, () => {
  generateJSONWithOptions('generateJSON: default');
});

test(`generate JSON with a custom extension matcher`, () => {
  generateJSONWithOptions('generateJSON: custom extension matcher', { extensions: ['.ts'] });
});

test(`generate JSON with depth of 1`, () => {
  generateJSONWithOptions('generateJSON: depth 1', { depth: 1 });
});

const ignorePatterns = ['^_', '^assets'];
test(`generate JSON with custom ignorePatterns: ${ignorePatterns}`, () => {
  generateJSONWithOptions('generateJSON: custom ignorePatterns',{ ignorePatterns });
});

const dirkey = '__customDir__';
test(`generate JSON with custom dirkey: ${dirkey}`, () => {
  generateJSONWithOptions('generateJSON: custom dirkey', { dirkey });
});
