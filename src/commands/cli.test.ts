import { cli } from '$commands/cli';

import {
  version,
  name,
  description,
} from '$pkg';

test('roullector version should match package.json:', () => {
  const writeMock = jest.fn();
  const program = cli()
    .exitOverride()
    .configureOutput({ writeOut: writeMock });

  const helpInformation = program.helpInformation();

  expect(helpInformation.includes(name)).toBe(true);
  expect(helpInformation.includes(description)).toBe(true);

  expect(() => {
    program.parse(['node', 'roullector', '--version']);
  }).toThrow(version);
  expect(writeMock).toHaveBeenCalledWith(`${version}\n`);
});
