export function createProxy(target, onChange) {
  const proxy = new Proxy(target, {
    get(t, property) {
      const item = target[property];
      if (item && typeof item === 'function') {
        return (...args) => {
          const output = item.apply(target, args);
          onChange();

          return output;
        };
      }

      if (item && typeof item === 'object') {
        return createProxy(item, onChange);
      }

      return item;
    },
    set(t, property, newValue) {
      target[property] = newValue;
      onChange();

      return true;
    },
  });

  return proxy;
}
