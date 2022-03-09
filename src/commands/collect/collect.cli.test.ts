import { resolve } from 'path';

import {
  vol,
  fs as memfs,
} from 'memfs';

import { collectCli } from '$commands/collect/collect.cli';
import { FILES } from '$tests/fixtures/memfs';

import { defaultCollectOptions } from './collect.constants';

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  const sourcePath = './generators/route/source.ts';
  const sourceOfRouteUtil = fs.readFileSync(resolve(__dirname, sourcePath), 'utf-8');
  vol.fromJSON({
    [sourcePath]: sourceOfRouteUtil,
  }, __dirname);

  return memfs;
});

const savedJSON = vol.toJSON();
beforeEach(() => {
  vol.fromNestedJSON(FILES, defaultCollectOptions.inDir);
  vol.fromJSON(savedJSON);
});
afterEach(() => {
  vol.reset();
});


test('cli collect: default --no-output', () => {
  const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
  const program = collectCli().exitOverride();
  program.parse(['node', 'collect', '--no-output']);
  expect(writeSpy).toHaveBeenCalledTimes(1);
  expect(writeSpy.mock.calls[writeSpy.mock.calls.length - 1][0]).toMatchSnapshot('cli collect: default');
});

test('cli collect: verbose', () => {
  const logInfo = jest.spyOn(console, 'info').mockImplementation();
  const tableSpy = jest.spyOn(console, 'table').mockImplementation();
  const program = collectCli().exitOverride();
  program.parse(['node', 'collect', '--no-output', '--verbose']);
  expect(logInfo).toHaveBeenCalled();
  expect(tableSpy).toHaveBeenCalled();
});
