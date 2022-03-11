import { commaSeparatedList } from '$utils/parser/commaSeparatedList';

test('an empty string => empty array', () => {
  expect(commaSeparatedList('')).toEqual([]);
});

test('a string => array', () => {
  expect(commaSeparatedList('a,b,c')).toEqual(['a', 'b', 'c']);
});

test('should trim white space for each element', () => {
  expect(commaSeparatedList('  a,   b  ,c  ')).toEqual(['a', 'b', 'c']);
});
