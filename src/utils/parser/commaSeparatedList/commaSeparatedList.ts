export function commaSeparatedList(value: string) {
  value = value.trim();
  if (!value.length) return [];
  return value.split(',').map((e) => e.trim());
}
