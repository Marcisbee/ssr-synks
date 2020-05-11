const sessions = {};

module.exports = {
  create(id) {
    return this.get(id) || (sessions[id] = {
      events: [],
      tree: null,
      html: null,
    });
  },
  update(id, value) {
    return Object.assign(this.get(id), value);
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
