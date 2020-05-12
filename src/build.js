const Entry = require('./entry');
const sessionController = require('./sessionController');

module.exports = function build(sessionId) {
  const session = sessionController.create(sessionId);
  const app = session.html ? session : Entry({ sessionId });

  session.html = app.html;
  session.tree = app.tree;

  return app;
}
