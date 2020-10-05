import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { GeneratorVnode } from './nodes/generator.js';
import { mergePrimitives } from './utils/merge-primitives.js';
import { transformPrimitives } from './utils/transform-primitives.js';

export function h(type, props = {}, ...childrenRaw) {
  const children = childrenRaw
    .flat()
    .reduce(mergePrimitives, [])
    .map(transformPrimitives);

  if (typeof type === 'function' && type.constructor.name === 'GeneratorFunction') {
    return new GeneratorVnode(
      type,
      props,
      children,
    );
  }

  if (typeof type === 'function') {
    return new ComponentVnode(
      type,
      props,
      children,
    );
  }

  return new ElementVnode(
    type,
    props,
    children,
  );
}
