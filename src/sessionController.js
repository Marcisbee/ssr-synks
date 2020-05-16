const sessions = {};

module.exports = {
  create(id) {
    return this.get(id) || (sessions[id] = {
      events: [],
      tree: {},
      message: null,
      html: null,
    });
  },
  async message(id, path, name, event) {
    const session = this.get(id);

    return await session.message(path, name, event);
  },
  update(id, path, value) {
    const session = this.get(id);
    session.events.forEach((event) => event(path, value));

    return session;
  },
  subscribe(id, handler) {
    const { events } = this.get(id);
    if (events.indexOf(handler) > -1) return;

    events.push(handler);
  },
  unsubscribe(id, handler) {
    const { events } = this.get(id) || { events: [] };
    events.splice(events.indexOf(handler), 1);
  },
  get(id) {
    return sessions[id];
  },
  remove(id) {
    delete sessions[id];
  },
}
