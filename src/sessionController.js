// import { unsubscribeTree } from './core/unsubscribe-tree.js';

const sessions = {};

export function get(id) {
  return sessions[id];
}

export function create(id, cookie) {
  const session = get(id);
  if (session && session.cookie === cookie) {
    return session;
  }

  return sessions[id] = {
    events: [],
    tree: {},
    message: null,
    html: null,
    instances: null,
    cookie,
  };
}

export async function message(id, path, name, event) {
  const session = get(id);

  return session.message(path, name, event);
}

export function update(id, path, value) {
  const session = get(id);
  session.events.forEach((event) => event(path, value));

  return session;
}

export function subscribe(id, handler) {
  const { events } = get(id);

  if (events.indexOf(handler) > -1) {
    return;
  }

  events.push(handler);
}

export function unsubscribe(id, handler) {
  const { events } = get(id) || { events: [] };
  events.splice(events.indexOf(handler), 1);
}

export function remove(id) {
  if (sessions[id]) {
    console.log('unsubscribe', id);
    // unsubscribeTree(sessions[id].tree);
  }
  delete sessions[id];
}
