export function camelCasify(str: string) {
  return str
    .trim()
    .replace(/\[([a-zA-Z_-]*)\](.?)/g, function(match, p1, p2) {
      return match.replace(/\[[$a-zA-Z_-]*\]/g, `-${p1}${p2.length && p1.length ? '-' : ''}`);
    })
    .replace(/[-_\s]+./g, function(match) {
      return match.replace(/[-_\s]/g, '').toUpperCase();
    })
    .replace(/[-_]$/g, '')
    .replace(/^(.)/, function(match) {
      return match.toLowerCase();
    });
}
