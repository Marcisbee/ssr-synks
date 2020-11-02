import { TextVnode } from '../nodes/text.js';
import { isPrimitive } from './is-primitive.js';

export function transformPrimitives(child) {
  if (isPrimitive(child)) {
    return new TextVnode(child);
  }

  return child;
}
