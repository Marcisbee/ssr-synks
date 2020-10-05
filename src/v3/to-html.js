import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { TextVnode } from './nodes/text.js';
// import { isContext } from './utils/is-context.js';

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

export function toHTML(current) {
  if (typeof current === 'undefined' || current === null) return '';
  if (typeof current !== 'object') return String(current);
  if (current instanceof Array) {
    const nodes = [];

    for (const i in current) {
      nodes.push(toHTML(current[i]));
    }

    return nodes.join('');
  }

  if (current instanceof TextVnode) {
    return current.value;
  }

  if (current instanceof ComponentVnode) {
    const name = current.type.name.toLowerCase();
    const children = toHTML(current.instance);

    return `<${name} data-sx="${current.id.join('.')}">${children}</${name}>`;
  }

  if (!(current instanceof ElementVnode)) {
    // Not recognized component, lets just return nothing instead of dealing with it
    return '';
  }

  const {
    id,
    props,
    type,
    children,
  } = current;

  // If it's context, just render children
  // if (isContext(type)) {
  //   const name = type.name.toLowerCase();
  //   return `<${name}>${toHTML(children)}</${name}>`;
  //   // return toHTML(children);
  // }

  const childNodes = children ? toHTML(children) : '';

  const attributes = Object.entries(props || {})
    .map(([key, originalValue]) => {
      const normalValue = originalValue instanceof Function
        ? `__sx('${id.join('.')}', event)`
        : originalValue;
      const value = JSON.stringify(String(normalValue));

      return `${key}=${value}`;
    });

  // To avoid awkward space between tag and ending of tag when there are no attributes
  const tagHead = [type].concat(attributes).join(' ');

  if (selfClosingTags.includes(type)) {
    return `<${tagHead}/>`;
  }

  return `<${tagHead}>${childNodes}</${type}>`;
}