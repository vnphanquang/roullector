import {
  dollarArgify,
  camelCasify,
  compose,
} from '$utils/transformer';

describe('dollarArgify => camelCasify', () => {
  const transformers = [dollarArgify, camelCasify];

  test('no [] should keep as if only camelCasify', () => {
    expect(compose('-_just--a__normal--test-_', ...transformers)).toBe('justANormalTest');
  });

  test('[id] should be transformed to $id', () => {
    expect(compose('[id]', ...transformers)).toBe('$id');
  });
});
