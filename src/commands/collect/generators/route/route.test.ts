import { resolve } from 'path';

import {
  fs as memfs,
  vol,
} from 'memfs';

import { defaultCollectOptions } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { generateRouteUtil } from '$commands/collect/generators/route';
import { route } from '$commands/collect/generators/route/source';

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  const sourcePath = './source.ts';
  const sourceOfRouteUtil = fs.readFileSync(resolve(__dirname, sourcePath), 'utf-8');
  vol.fromJSON({
    [sourcePath]: sourceOfRouteUtil,
  }, __dirname);
  return memfs;
});

describe('map path with route util', () => {
  test('static path: return same', () => {
    const path = '/a/literal/static/path';
    expect(route(path)).toBe(path);
  });

  test('dynamic path: argument is correctly injected', () => {
    const parent = '/a-path-with';
    const id = 'a-unique-id-123-124';
    expect(route(`${parent}/[arg]`, id)).toBe(`${parent}/${id}`);
  });

  test('dynamic path: multiple arguments are injected as specified', () => {
    const path = '/a-path-with/[arg_snake]/and/[arg-kebab]/and/[argCamel]';
    const argSnake = 'snake';
    const argKebab = 'kebab';
    const argCamel = 'camel';

    const routed = route(path, argSnake, argKebab, argCamel);
    expect(routed).toBe(`/a-path-with/${argSnake}/and/${argKebab}/and/${argCamel}`);
  });
});

describe('generate route utils:', () => {
  const savedJSON = vol.toJSON();
  beforeEach(() => {
    vol.fromJSON(savedJSON);
  });
  afterEach(() => {
    vol.reset();
  });

  const generateRouteUtilWithOptions = (snapshotToMatch: string, options: Partial<CollectOptions> = {}) => {
    const outputPath = generateRouteUtil({
      ...defaultCollectOptions,
      ...options,
    });
    const generated = memfs.readFileSync(outputPath, 'utf-8');
    expect(generated).toMatchSnapshot(snapshotToMatch);
  };

  test('with default options', () => {
    generateRouteUtilWithOptions('generateRouteUtil: default');
  });

  test('to javascript only', () => {
    generateRouteUtilWithOptions('mockImplementation: javascript', { typescript: false });
  });
});

