export function isGenerator(value) {
  if (typeof value !== 'function') return false;

  const { prototype } = value;

  return prototype && prototype.toString() === '[object Generator]';
  // return typeof value === 'function' && value.constructor.name === 'GeneratorFunction';
}
