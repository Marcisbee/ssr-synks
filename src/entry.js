const { resolve } = require("path");
const sessionController = require("./sessionController");

const h = require("./core/h");
const mount = require("./core/mount");
const createHTML = require("./core/create-html");

module.exports = async function Entry(props = {}, { renderHtml = false } = {}) {
  const indexPath = resolve('./index.tsx');
  const Index = require(indexPath).default;

  const session = sessionController.get(props.sessionId);

  function update(path, component, diff, root, context) {
    sessionController.update(props.sessionId, path.join('.'), diff);
  }

  const initialTree = h(Index, props);
  const {
    methods,
    tree,
  } = await mount(initialTree, undefined, update);

  async function message(path, name, event) {
    const methodsInPath = methods[path];
    if (methodsInPath && methodsInPath[name]) {
      return await methodsInPath[name](event);
    }
  };

  const html = await createHTML(tree);

  return {
    events: session.events,
    tree,
    html,
    message,
  };
}
