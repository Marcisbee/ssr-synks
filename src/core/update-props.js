export function updateProps(current, context) {
  const props = Object.entries(current.props || {});
  const path = (current.path || []).join('.');
  const { methods } = context;

  props.forEach(([rawKey, value]) => {
    if (value instanceof Function) {
      const key = rawKey.replace(/^on/, '');
      if (typeof methods[path] === 'undefined') {
        methods[path] = {};
      }

      methods[path][key] = value;
    }
  });
}
