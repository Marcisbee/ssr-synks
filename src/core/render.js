module.exports = function render(node, context) {
  if (node instanceof Array) {
    return node.map(render).join('');
  }

  if (!node || typeof node.type === 'undefined') {
    return node;
  }

  const { type, props, children } = node;

  if (type instanceof Function) {
    const scope = {
      next() {
        const rendered = selfRender();

        if (context.session && context.session.events) {
          context.session.html = rendered;
          context.session.events.forEach((event) => {
            event(rendered);
          });
        }
      },
    };

    function selfRender() {
      const output = type.apply(scope, [{
        ...props,
        children,
      }]);

      const childNodes = render(output);

      return `<!-- ${type.name}() -->${childNodes}`;
    }

    return selfRender();
  }

  const childNodes = render(children);

  return `<${type}>${childNodes}</${type}>`;
}
