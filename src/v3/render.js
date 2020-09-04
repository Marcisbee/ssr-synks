import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { transformPrimitives } from './utils/transform-primitives.js';

export function render(nodeRaw, id = [0]) {
  const node = transformPrimitives(nodeRaw);

  node.id = id;

  if (node instanceof ComponentVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index)),
    );

    node.instance = node.type.call({}, { ...node.props, children: node.children });

    return node;
  }

  if (node instanceof ElementVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index)),
    );

    return node;
  }

  return node;
}
