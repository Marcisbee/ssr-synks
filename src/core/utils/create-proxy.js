export function createProxy(target, onChange) {
  const proxy = new Proxy(target, {
    get(t, property) {
      const item = target[property];
      if (item && typeof item === 'function' && property[0] !== '_') {
        return (...args) => {
          const output = item.apply(target, args);
          onChange();

          return output;
        };
      }

      return item;
    },
    set(t, property, newValue) {
      target[property] = newValue;

      return newValue;
    },
  });

  return proxy;
}
