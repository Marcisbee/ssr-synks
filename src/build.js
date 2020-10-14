import { entry } from './entry.js';
import { create } from './sessionController.js';
import { toHTML } from './v3/to-html.js';

export async function build(sessionId, cookie) {
  const session = create(sessionId, cookie);

  if (session.html) {
    session.html = await toHTML(session.tree);
    return session;
  }

  const app = await entry({
    props: {
      sessionId,
      cookie,
    },
  });

  session.message = app.message;
  session.html = app.html;
  session.tree = app.tree;

  return app;
}
