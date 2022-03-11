import { dollarArgify } from '$utils/transformer/dollarArgify';

test('[...] should be transformed to $...', () => {
  expect(dollarArgify('[]')).toBe('$');
  expect(dollarArgify('[arg]')).toBe('$arg');
  expect(dollarArgify('[one]_some[two]some-some[three]')).toBe('$one$_some$two$some-some$three');
});

test('multiple consecutive [...] should be transformed accordingly', () => {
  expect(dollarArgify('[]-[][]_[]')).toBe('$-$_$');
  expect(dollarArgify('[]-[two][]_[]')).toBe('$-$two$_$');
  expect(dollarArgify('[]-[][three]_[]')).toBe('$-$three$_$');
  expect(dollarArgify('[]-[two][three]_[]')).toBe('$-$two$three$_$');
  expect(dollarArgify('[one]-[two][three]_[four]')).toBe('$one$-$two$three$_$four');
  expect(dollarArgify('[one]-[][three]_[]')).toBe('$one$-$three$_$');
  expect(dollarArgify('[]-[two][]_[four]')).toBe('$-$two$_$four');
});
