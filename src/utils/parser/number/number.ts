import { InvalidArgumentError } from 'commander';

export function number(value: string) {
  let parsedValue: number;

  value = value.trim().toLowerCase();
  if (value.endsWith('infinity')) {
    if (value.startsWith('-')) {
      parsedValue = -Infinity;
    } else {
      parsedValue = Infinity;
    }
    return parsedValue;
  }

  parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}
