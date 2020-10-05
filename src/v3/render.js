import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { GeneratorVnode } from './nodes/generator.js';
import { isContext } from './utils/is-context.js';
import { parseProps } from './utils/parse-props.js';
import { transformPrimitives } from './utils/transform-primitives.js';

export function render(nodeRaw, id = [0], context) {
  const node = transformPrimitives(nodeRaw);

  node.id = id;

  // @TODO: Replace output functions with paths
  if (node instanceof GeneratorVnode) {
    // eslint-disable-next-line no-inner-declarations
    function selfRender() {
      node.children = node.children.map(
        (child, index) => render(child, id.concat(index), context),
      );

      function update() {
        const previousInstance = node.instance;

        // Render component
        selfRender();

        context.onUpdate(node.id, node.instance, previousInstance);
      }

      // node.iterable = node.type({ ...node.props, children: node.children });
      node.iterable = node.type.call(
        { update },
        { ...node.props, children: node.children },
      );
      let instance = node.iterable.next();

      while (isContext(instance.value)) {
        const contextName = instance.value.name;
        const currentContext = context.instances[contextName];

        if (typeof currentContext === 'undefined') {
          throw new Error(`Trying to access "${contextName}" in <${node.type.name}> component, but it was not defined in parent tree`);
        }

        console.log({
          instance: instance.value,
          contextName,
          currentContext,
        });

        instance = node.iterable.next();
      }

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
    }

    // Render component
    selfRender();

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
