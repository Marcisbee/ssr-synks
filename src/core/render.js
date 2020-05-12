const asyncMap = require('../utils/async-map');

module.exports = async function render(node, previousNode, context) {
  if (node instanceof Array) {
    return (await asyncMap(node, render)).join('');
  }

  if (!node || typeof node.type === 'undefined') {
    return node;
  }

  const { type, props, children } = node;

  if (type instanceof Function) {

    async function update(newState) {
      const rendered = await selfRender(node.state = newState);

      if (context.session && context.session.events) {
        context.session.html = rendered;
        context.session.events.forEach((event) => {
          event(rendered);
        });
      }
    };

    async function selfRender(state) {
      const output = await type(
        {
          ...props,
          children,
        },
        state,
        update
      );

      const childNodes = await render(output, node.instance);

      node.instance = childNodes;

      return `<!-- ${type.name}() -->${childNodes}`;
    }

    return await selfRender(node.state);
  }

  const childNodes = await render(children, previousNode && previousNode.children);

  return `<${type}>${childNodes}</${type}>`;
}
