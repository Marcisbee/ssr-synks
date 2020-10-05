import { TextVnode } from '../nodes/text.js';
import { isPrimitive } from './is-primitive.js';

export function mergePrimitives(acc, value) {
  if (acc.length === 0) {
    return [value];
  }

  const lastValue = acc[acc.length - 1];

  if (isPrimitive(lastValue) && isPrimitive(value)) {
    return acc.slice(0, -1).concat(`${lastValue}${value}`);
  }

  if (lastValue instanceof TextVnode && isPrimitive(value)) {
    lastValue.value = `${lastValue.value}${value}`;
    return acc;
  }

  if (lastValue instanceof TextVnode && value instanceof TextVnode) {
    lastValue.value = `${lastValue.value}${value.value}`;
    return acc;
  }

  if (lastValue instanceof TextVnode && (value === null || value === undefined)) {
    return acc;
  }

  return acc.concat(value);
}
