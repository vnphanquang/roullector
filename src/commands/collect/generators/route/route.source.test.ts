import { route } from '$commands/collect/generators/route/route.source';

describe('map path with route util', () => {
  test('static path: return same', () => {
    const path = '/a/literal/static/path';
    expect(route(path)).toBe(path);
  });

  test('dynamic path: argument is correctly injected', () => {
    const parent = '/a-path-with';
    const id = 'a-unique-id-123-124';
    expect(route(`${parent}/[arg]`, id)).toBe(`${parent}/${id}`);
  });

  test('dynamic path: multiple arguments are injected as specified', () => {
    const path = '/a-path-with/[arg_snake]/and/[arg-kebab]/and/[argCamel]';
    const argSnake = 'snake';
    const argKebab = 'kebab';
    const argCamel = 'camel';

    const routed = route(path, argSnake, argKebab, argCamel);
    expect(routed).toBe(`/a-path-with/${argSnake}/and/${argKebab}/and/${argCamel}`);
  });
});
