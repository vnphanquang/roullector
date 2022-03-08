/**
 * build a complete path with injected arguments
 * @param path {string} based path
 * @param args {string[]} arguments to inject
 */
export function route(path: string, ...args: string[]): string {
  const params = path.match(/\[[a-zA-Z_-]+\]/g) ?? [];
  for (const i in params) {
    path = path.replace(params[i], args[i]);
  }
  return path;
}
