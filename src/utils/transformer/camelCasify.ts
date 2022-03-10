export function camelCasify(str: string) {
  return str
    .trim()
    .replace(/[-_\s]+./g, function(match) {
      return match.replace(/[-_\s]/g, '').toUpperCase();
    })
    .replace(/^(.)/, function(match) {
      return match.toLowerCase();
    });
}
