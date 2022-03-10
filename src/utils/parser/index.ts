import { InvalidArgumentError } from 'commander';

export function number(value: string) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

export function commaSeparatedList(value: string) {
  return value.split(',');
}
