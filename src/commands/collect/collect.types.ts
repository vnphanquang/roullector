type Modify<T, R> = Omit<T, keyof R> & R;

export type CollectOptions = {
  /** input directory path to collect route data from */
  inDir: string;
  /** file extensions */
  extensions: string[];
  /** patterns to ignore files */
  ignorePatterns: (string|RegExp)[];
  /** route data output directory path */
  outDir: string;
  /** whether to output utils in typescript */
  typescript: boolean;
  /** prints more info during operation */
  verbose: boolean;
  /** how to transform route key */
  keyTransform: (key: string) => string;
  /** depth of inDir to collect */
  depth: number;
  /** key to save path for directories with no index file */
  dirkey: string;
};

export type CliCollectOptions = Modify<CollectOptions, {
  depth: string;
  extensions?: string;
  ignorePatterns?: string;
  keyTransform: 'camelCase';
}>;
