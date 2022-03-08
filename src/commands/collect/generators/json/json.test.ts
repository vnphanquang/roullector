import {
  vol,
  fs,
} from 'memfs';

import { defaultCollectOptions } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { generateJSON } from '$commands/collect/generators/json';

jest.mock('fs', () => fs);

const defaultOptions: CollectOptions = defaultCollectOptions;

beforeEach(() => {
  vol.fromNestedJSON({
    '__components': {
      'Navbar.svelte': '',
      'Footer.svelte': '',
    },
    '__layout.svelte': '',
    '__error.svelte': '',
    'me.svelte': '',
    'sign-in.svelte': '',
    'sign-up.svelte': '',
    'index.svelte': '',
    'admin': {
      '__components': {
        'Admin.layout.svelte': '',
        'types.ts': '',
      },
      'users': {
        '[id]': {
          'index.svelte': '',
          'types': '',
        },
        'assets': {
          '__layout.svelte': '',
          'index.svelte': '',
          'photos': {
            '[id]': {
              'types': '',
              'index.svelte': '',
            },
          },
          'posts': {
            'youtube': {
              'types': '',
              '[id].svelte': '',
              '[slug].svelte': '',
            },
          },
        },
      },
    }
  }, 'src/routes');
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
