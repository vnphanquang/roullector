import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolver from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const plugins = [
  typescript({
    typescript: require('ttypescript'),
    tsconfigDefaults: {
      compilerOptions: {
        plugins: [
          { transform: 'typescript-transform-paths' },
          { transform: 'typescript-transform-paths', afterDeclarations: true },
        ],
      },
    },
  }),
  nodeResolver(),
  commonjs(),
  filesize(),
];

const external = [];

/** @type {import('rollup').RollupOptions} */
const config = [
  // {
  //   input: resolve(__dirname, './src/index.ts'),
  //   output: {
  //     file: resolve(__dirname, pkg.main),
  //     format: 'cjs',
  //     sourcemap: true,
  //   },
  //   external,
  //   plugins,
  // },
  {
    input: resolve(__dirname, './src/cli.ts'),
    output: {
      banner: '#!/usr/bin/env node',
      file: resolve(__dirname, pkg.bin.roullector),
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins,
  },
];

export default config;
