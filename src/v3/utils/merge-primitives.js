import { isPrimitive } from './is-primitive.js';

export function mergePrimitives(acc, value) {
  if (acc.length === 0) {
    return [value];
  }

  const lastValue = acc[acc.length - 1];

  if (isPrimitive(lastValue) && isPrimitive(value)) {
    return acc.slice(0, -1).concat(`${lastValue}${value}`);
  }

  return acc.concat(value);
}
