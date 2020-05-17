const pathCompress = require("./path-compress");

module.exports = async function createHTML(current, previous) {
  if (typeof current === 'undefined' || current === null || current === NaN) return '';
  if (typeof current !== 'object') return String(current);
  if (current instanceof Array) {
    const nodes = [];

    for (const i in current) {
      nodes.push(await createHTML(current[i], previous && previous[i]));
    }

    return nodes.join('');
  }
  const { path, props, type, instance, children } = current;

  if (typeof instance !== 'undefined') {
    return createHTML(instance, previous && previous.instance);
  }

  const childNodes = children ? await createHTML(children, previous && previous.children) : '';

  const attributes = Object.entries({
    ...props,
    'data-sx': pathCompress(path.join('.')),
  }).map(([key, value]) => {
    const normalValue = value instanceof Function
      ? '__sx(event)'
      : value;
    return `${key}=${JSON.stringify(String(normalValue))}`;
  }).join(' ');

  return `<${type} ${attributes}>${childNodes}</${type}>`;
}
