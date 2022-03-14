import { resolve } from 'path';

import {
  fs as memfs,
  vol,
} from 'memfs';
import { transpile } from 'typescript';

import { defaultCollectOptions } from '$commands/collect/collect.constants';
import type { CollectOptions } from '$commands/collect/collect.types';
import { generateRouteUtil } from '$commands/collect/generators/route';

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  const sourcePath = './route.source.ts';
  const sourceOfRouteUtil = fs.readFileSync(resolve(__dirname, sourcePath), 'utf-8');
  vol.fromJSON({
    [sourcePath]: sourceOfRouteUtil,
  }, resolve(__dirname, '..'));
  return memfs;
});

describe('generate route utils:', () => {
  const savedJSON = vol.toJSON();
  const sourcePath = './route.source.ts';
  const sourceOfRouteUtil = vol.readFileSync(resolve(__dirname, '..', sourcePath), {
    encoding: 'utf-8',
  });
  savedJSON[sourcePath.replace('.ts', '.js')] = transpile(sourceOfRouteUtil.toString());

  beforeEach(() => {
    vol.fromJSON(savedJSON, resolve(__dirname, '..'));
  });
  afterEach(() => {
    vol.reset();
  });

  const generateRouteUtilWithOptions = (snapshotToMatch: string, options: Partial<CollectOptions> = {}) => {
    const generated = generateRouteUtil({
      ...defaultCollectOptions,
      ...options,
    });
    expect(generated).toMatchSnapshot(snapshotToMatch);
  };

  test('with default options', () => {
    generateRouteUtilWithOptions('generateRouteUtil: default');
  });

  test('to javascript only', () => {
    generateRouteUtilWithOptions('mockImplementation: javascript', { typescript: false });
  });
});

