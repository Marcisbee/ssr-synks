const { resolve } = require("path");
const sessionController = require("./sessionController");

const render = require("./core/render");
const h = require("./core/h");

async function Entry(props = {}, { renderHtml = false } = {}) {
  const indexPath = resolve('./index.tsx');
  const Index = require(indexPath).default;

  let events = [];
  const tree = h(Index, props);
  const html = await render(tree, undefined, {
    sessionId: props.sessionId,
    session: sessionController.get(props.sessionId),
  });

  return {
    events,
    tree,
    html,
  };
}

module.exports = Entry;
