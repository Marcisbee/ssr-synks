const { resolve } = require("path");
const sessionController = require("./sessionController");

const render = require("./core/render");
const h = require("./core/h");

const Index = require(resolve('./index.tsx')).default;

function app(props = {}) {
  let events = [];
  const tree = h(Index, props);
  const html = render(tree, {
    sessionId: props.sessionId,
    session: sessionController.get(props.sessionId),
  });

  return {
    events,
    tree,
    html,
  };
}

module.exports = app;
