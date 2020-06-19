export function isNode(current) {
  if (current === null || typeof current !== 'object') {
    return false;
  }

  return typeof current.type !== 'undefined';
}
