module.exports = function render(node, context) {
  if (node instanceof Array) {
    return node.map(render).join('');
  }

  if (!node || typeof node.type === 'undefined') {
    return node;
  }

  const { type, props, children } = node;

  if (type instanceof Function) {
    const update = (newState) => {
      const rendered = selfRender(node.state = newState);

      if (context.session && context.session.events) {
        context.session.html = rendered;
        context.session.events.forEach((event) => {
          event(rendered);
        });
      }
    };

    function selfRender(state) {
      const output = type(
        {
          ...props,
          children,
        },
        state,
        update
      );

      const childNodes = render(output);

      return `<!-- ${type.name}() -->${childNodes}`;
    }

    return selfRender(node.state);
  }

  const childNodes = render(children);

  return `<${type}>${childNodes}</${type}>`;
}
