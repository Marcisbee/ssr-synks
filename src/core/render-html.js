import { pathCompress } from './path-compress';

const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export async function renderHTML(current, previous) {
  if (typeof current === 'undefined' || current === null) return '';
  if (typeof current !== 'object') return String(current);
  if (current instanceof Array) {
    const nodes = [];

    for (const i in current) {
      nodes.push(await renderHTML(current[i], previous && previous[i]));
    }

    return nodes.join('');
  }

  const {
    path,
    props,
    type,
    instance,
    children,
  } = current;

  if (typeof instance !== 'undefined') {
    return renderHTML(instance, previous && previous.instance);
  }

  const childNodes = children ? await renderHTML(children, previous && previous.children) : '';

  const attributes = Object.entries({
    ...props,
    'data-sx': pathCompress(path.join('.')),
  }).map(([key, value]) => {
    const normalValue = value instanceof Function
      ? '__sx(event)'
      : value;
    return `${key}=${JSON.stringify(String(normalValue))}`;
  }).join(' ');

  if (selfClosingTags.includes(type)) {
    return `<${type} ${attributes}/>`;
  }

  return `<${type} ${attributes}>${childNodes}</${type}>`;
}
