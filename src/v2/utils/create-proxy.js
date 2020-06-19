export function createProxy(target, onChange) {
  return new Proxy(target, {
    get(t, property) {
      const item = target[property];
      if (item && typeof item === 'object') return createProxy(item, onChange);

      return item;
    },
    set(t, property, newValue) {
      target[property] = newValue;
      onChange();

      return true;
    },
  });
}
