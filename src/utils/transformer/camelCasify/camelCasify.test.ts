import { camelCasify } from '$utils/transformer/camelCasify';

test('should trim both ends (white space, "_", and "-")', () => {
  expect(camelCasify('  camelCaseWord  ')).toBe('camelCaseWord');
  expect(camelCasify('-_-camelCaseWord__')).toBe('camelCaseWord');
  expect(camelCasify('  camelCaseWord_-')).toBe('camelCaseWord');
});

test('camelCase should stay the same', () => {
  expect(camelCasify('camelCaseWord')).toBe('camelCaseWord');
  expect(camelCasify('-camelCaseWord')).toBe('camelCaseWord');
  expect(camelCasify('camelCaseWord-')).toBe('camelCaseWord');
  expect(camelCasify('-camelCaseWord-')).toBe('camelCaseWord');
});

test('first character should be lowercase', () => {
  expect(camelCasify('FirstCharacter')).toBe('firstCharacter');
});

test('kebab-case should be transformed to camelCase', () => {
  expect(camelCasify('kebab-case-word')).toBe('kebabCaseWord');
});

test('snake_case should be transformed to camelCase', () => {
  expect(camelCasify('snake_case_word')).toBe('snakeCaseWord');
});

test('complex mix between casing should be transformed to camelCase', () => {
  expect(camelCasify('snake_case-mix_with-kebabAnd-CamelCasePhrase')).toBe('snakeCaseMixWithKebabAndCamelCasePhrase');
});

test('[...] should also be transformed to camelCase', () => {
  expect(camelCasify('[]mix-[argOne]-pre[argTwo]post-a[]a-[]')).toBe('mixArgOnePreArgTwoPostAA');
});
