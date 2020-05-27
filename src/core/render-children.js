const { renderArray } = require('./render');

async function renderChildren(current, context) {
  const newContext = {
    ...context,
    previous: (context.previous && context.previous.children) || [],
  };
  current.children = await renderArray(current.children, newContext);
}

module.exports = {
  renderChildren,
};
