import { renderHTML } from './core/render-html.js';
import { entry } from './entry.js';
import { create } from './sessionController.js';

export async function build(sessionId, cookie) {
  const session = create(sessionId, cookie);

  if (session.html) {
    session.html = await renderHTML(session.tree);
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
