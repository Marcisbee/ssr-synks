export function atom(state) {
  let events = [];

  return {
    get(handler) {
      if (events.indexOf(handler) === -1) {
        events.push(handler);
      }

      return state;
    },
    set(fn) {
      state = fn(state);

      const cache = events.slice();
      events = [];

      cache.forEach((fn2) => fn2((s) => s));

      return state;
    },
  };
}

export function use(table, handler) {
  return [
    table.get(handler),
    (fn) => table.set(fn),
  ];
}
