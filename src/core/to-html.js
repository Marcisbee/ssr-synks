import { isContext } from './utils/is-context.js';

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

export async function toHTML(current) {
  if (typeof current === 'undefined' || current === null) return '';
  if (typeof current !== 'object') return String(current);
  if (current instanceof Array) {
    const nodes = [];

    for (const i in current) {
      nodes.push(await toHTML(current[i]));
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

  // Render instance if it's defined
  if (typeof instance !== 'undefined') {
    const name = type.name.toLowerCase();
    return `<${name} data-sx="${path.join('.')}">${await toHTML(instance)}</${name}>`;
    // return toHTML(instance);
  }

  // If it's context, just render children
  if (isContext(type)) {
    const name = type.name.toLowerCase();
    return `<${name}>${await toHTML(children)}</${name}>`;
    // return toHTML(children);
  }

  const childNodes = children ? await toHTML(children) : '';

  const attributes = Object.entries({
    ...props,
    // 'data-sx': path.join('.'),
    // 'data-sx': pathCompress(path.join('.')),
  }).map(([key, value]) => {
    const normalValue = value instanceof Function
      ? `__sx('${path.join('.')}', event)`
      : value;
    return `${key}=${JSON.stringify(String(normalValue))}`;
  }).join(' ');

  if (selfClosingTags.includes(type)) {
    return `<${type} ${attributes}/>`;
  }

  return `<${type} ${attributes}>${childNodes}</${type}>`;
}