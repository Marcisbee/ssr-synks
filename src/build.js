const { entry } = require('./entry');
const sessionController = require('./sessionController');
const { renderHTML } = require('./core/render-html');

async function build(sessionId) {
  const session = sessionController.create(sessionId);

  if (session.html) {
    session.html = await renderHTML(session.tree);
    return session;
  }

  const app = await entry({
    props: {
      sessionId,
    },
  });

  session.message = app.message;
  session.html = app.html;
  session.tree = app.tree;

  return app;
}

module.exports = {
  build,
};
