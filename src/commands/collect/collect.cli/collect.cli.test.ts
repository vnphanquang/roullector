import { resolve } from 'path';

import {
  vol,
  fs as memfs,
} from 'memfs';

import { collectCli } from '$commands/collect/collect.cli';
import {
  defaultCollectOptions,
  MAPPING_FILENAME,
} from '$commands/collect/collect.constants';
import { FILES } from '$tests/fixtures/memfs';

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  const sourcePath = '../generators/route/route.source.ts';
  const sourceOfRouteUtil = fs.readFileSync(resolve(__dirname, sourcePath), 'utf-8');
  vol.fromJSON({
    ['./generators/route.source.ts']: sourceOfRouteUtil,
  }, resolve(__dirname, '..'));

  return memfs;
});

const savedJSON = vol.toJSON();
beforeEach(() => {
  vol.fromNestedJSON(FILES, defaultCollectOptions.inDir);
  vol.fromJSON(savedJSON, resolve(__dirname, '..'));
});
afterEach(() => {
  vol.reset();
});

test('cli collect: default => generate files exist', () => {
  const writeSpy = jest.spyOn(console, 'log').mockImplementation();
  const program = collectCli().exitOverride();
  program.parse(['node', 'collect']);
  expect(writeSpy).toHaveBeenCalledTimes(0);
  const { outDir } = defaultCollectOptions;
  const json = resolve(outDir, MAPPING_FILENAME);
  expect(memfs.existsSync(json)).toBe(true);
  const index = resolve(outDir, 'index.ts');
  expect(memfs.existsSync(index)).toBe(true);
});

test('cli collect: default --no-output no-arg', () => {
  const writeSpy = jest.spyOn(console, 'log').mockImplementation();
  const program = collectCli().exitOverride();
  program.parse(['node', 'collect', '--no-output']);
  expect(writeSpy).toHaveBeenCalledTimes(1);
  expect(writeSpy.mock.calls[writeSpy.mock.calls.length - 1][0]).toMatchSnapshot('cli collect: default');
});

test('cli collect: default --no-output with all default args', () => {
  const writeSpy = jest.spyOn(console, 'log').mockImplementation();
  const program = collectCli().exitOverride();
  program.parse([
    'node',
    'collect',
    '--no-output',
    '--inDir=src/routes',
    '--extensions=.svelte',
    '--ignorePatterns=^_',
    '--outDir=src/generated/routing',
    '--depth=Infinity',
    '--keyTransform=dollarArg',
    '--keyTransform=camelCase',
  ]);
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

test('cli collect: invalid keyTransform choice', () => {
  const program = collectCli().exitOverride();
  expect(() => {
    program.parse(['node', 'collect', '--no-output', '--keyTransform=invalid']);
  }).toThrow();
});
