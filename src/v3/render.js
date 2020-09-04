import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { GeneratorVnode } from './nodes/generator.js';
import { parseProps } from './utils/parse-props.js';
import { transformPrimitives } from './utils/transform-primitives.js';

export function render(nodeRaw, id = [0], context) {
  const node = transformPrimitives(nodeRaw);

  node.id = id;

  if (node instanceof GeneratorVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index), context),
    );

    node.iterable = node.type({ ...node.props, children: node.children });
    let instance = node.iterable.next();

    // @TODO: Handle multiple contexts
    // while (isContext(rawInstance.value)) {
    //   const contestName = rawInstance.value.name;
    //   const currentContext = context.instances[contestName];

    //   if (typeof currentContext === 'undefined') {
    //     throw new Error(`Trying to access "${contestName}" in <${current.type.name}> component, but it was not defined in parent tree`);
    //   }

    //   const [contextInstance, subscribe] = context.instances[contestName];

    //   current.subscribed.push(
    //     subscribe(update),
    //   );

    //   rawInstance = await iterable.next(contextInstance);
    // }

    node.instance = render(
      instance.value,
      id.concat(0),
      context,
    );

    return node;
  }

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
