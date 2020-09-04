import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { parseProps } from './utils/parse-props.js';
import { transformPrimitives } from './utils/transform-primitives.js';

export function render(nodeRaw, id = [0], context) {
  const node = transformPrimitives(nodeRaw);

  node.id = id;

  if (node instanceof ComponentVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index), context),
    );

    node.instance = render(
      node.type.call({}, { ...node.props, children: node.children }),
      id.concat(0),
      context,
    );

    return node;
  }

  if (node instanceof ElementVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index), context),
    );

    parseProps(node, context);

    return node;
  }

  return node;
}
