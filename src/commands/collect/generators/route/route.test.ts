import { resolve } from 'path';

import {
  fs as memfs,
  vol,
} from 'memfs';

import { defaultCollectOptions } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { generateRouteUtil } from '$commands/collect/generators/route';

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  const sourcePath = './source.ts';
  const sourceOfRouteUtil = fs.readFileSync(resolve(__dirname, sourcePath), 'utf-8');
  vol.fromJSON({
    [sourcePath]: sourceOfRouteUtil,
  }, __dirname);
  return memfs;
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

