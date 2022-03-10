export type CollectOptions = {
  /** input directory path to collect route data from */
  inDir: string;
  /** file extensions */
  extensions: string[];
  /** patterns to ignore files */
  ignorePatterns: (string|RegExp)[];
  /** whether to write to disk. If false will print to console in command-line mode, or returned in lib usage */
  output: boolean;
  /** route data output directory path */
  outDir: string;
  /** prints more info during operation */
  verbose: boolean;
  /** how to transform route key */
  keyTransform: KeyTransformFn[];
  /** depth of inDir to collect */
  depth: number;
  /** key to save path for directories with no index file */
  dirkey: string;
  /** generate utils for building path with arguments */
  utils: boolean;
  /** whether to output files in typescript */
  typescript: boolean;
};

export type CollectOutput = {
  /** path to generated json, if options.output is false, this is the generated output itself */
  json: null|string;
  /** path to generated route util, if options.output is false, this is the generated output itself */
  route: null|string;
};

export enum KeyTransformCli {
  none = 'none',
  camelCase = 'camelCase',
  dollarArg = 'dollarArg',
}

export type KeyTransformFn = (key: string, original: string) => string;
