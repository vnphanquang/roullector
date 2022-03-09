import {
  resolve,
  dirname,
} from 'path';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolver from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const plugins = [
  typescript({
    typescript: require('ttypescript'),
    tsconfig: resolve(__dirname, 'tsconfig.build.json'),
    tsconfigDefaults: {
      compilerOptions: {
        plugins: [
          { transform: 'typescript-transform-paths' },
          { transform: 'typescript-transform-paths', afterDeclarations: true },
        ],
      },
    },
  }),
  json(),
  nodeResolver(),
  commonjs(),
  filesize(),
];

const external = [];

const utilRoutePath = resolve(__dirname, './src/commands/collect/generators/route/source.ts');

/** @type {import('rollup').RollupOptions} */
const config = [
  {
    input: resolve(__dirname, './src/lib.ts'),
    output: {
      file: resolve(__dirname, pkg.main),
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins: [
      ...plugins,
      copy({
        targets: [
          {
            src: utilRoutePath,
            dest: resolve(__dirname, dirname(pkg.main)),
          },
        ],
      }),
    ],
  },
  {
    input: resolve(__dirname, './src/bin.ts'),
    output: {
      banner: '#!/usr/bin/env node',
      file: resolve(__dirname, pkg.bin.roullector),
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins: [
      ...plugins,
      copy({
        targets: [
          {
            src: utilRoutePath,
            dest: resolve(__dirname, dirname(pkg.bin.roullector)),
          },
        ],
      }),
    ],
  },
];

export default config;
