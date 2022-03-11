import { InvalidArgumentError } from 'commander';

import { number } from '$utils/parser/number';

test('parse a number', () => {
  expect(number('1')).toBe(1);
});

test('parse Infinity', () => {
  expect(number('Infinity')).toBe(Infinity);
  expect(number('+infinity')).toBe( Infinity);
  expect(number('-Infinity')).toBe(-Infinity);
  expect(number('-infinity')).toBe(-Infinity);
});

test('parse a non-number', () => {
  expect(() => number('a')).toThrow(InvalidArgumentError);
});
