type TransformFn = (key: string, original?: string) => string;

export function compose(original: string, ...transformers: TransformFn[]) {
  return transformers.reduce((acc, transformer) => transformer(acc, original), original);
}
