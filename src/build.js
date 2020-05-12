const Entry = require('./entry');
const sessionController = require('./sessionController');

module.exports = async function build(sessionId) {
  const session = sessionController.create(sessionId);
  const app = session.html ? session : await Entry({ sessionId });

  session.html = app.html;
  session.tree = app.tree;

  return app;
}
