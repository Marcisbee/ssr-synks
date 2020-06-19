export function isGenerator(value) {
  return typeof value === 'function' && value.prototype.toString() === '[object Generator]';
  // return typeof value === 'function' && value.constructor.name === 'GeneratorFunction';
}
