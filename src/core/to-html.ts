import { ComponentVnode } from './nodes/component.js';
import { ContextVnode } from './nodes/context.js';
import { ElementVnode } from './nodes/element.js';
import { TextVnode } from './nodes/text.js';

const navigationHandler = '__sn(event)';
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

function normalizeComponentName(name) {
  return name.replace(/[A-Z]/g, (match, index) => {
    const newMatch = match.toLowerCase();

    if (!index) {
      return newMatch;
    }

    return `-${newMatch}`;
  });
}

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

  // If it's context, just render children
  if (current instanceof ContextVnode) {
    const name = normalizeComponentName(current.type.name);
    return `<${name}>${toHTML(current.children)}</${name}>`;
  }

  if (current instanceof ComponentVnode) {
    const name = normalizeComponentName(current.type.name);
    const children = toHTML(current.instance);

    return `<${name}>${children}</${name}>`;
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

  const ensuredProps = props || {};
  const childNodes = children ? toHTML(children) : '';

  const canNavigate = type === 'a' && !!ensuredProps.href;
  const hasOnclick = !!ensuredProps.onclick;

  const attributes = Object.entries(ensuredProps)
    .map(([key, originalValue]) => {
      let normalValue = originalValue instanceof Function
        ? `__sx('${id.join('.')}', event)`
        : originalValue;

      if (canNavigate && hasOnclick && key === 'onclick') {
        normalValue = `${normalValue};${navigationHandler}`;
      }

      const value = JSON.stringify(String(normalValue));

      return `${key}=${value}`;
    });

  if (canNavigate && !hasOnclick) {
    attributes.push(`onclick="${navigationHandler}"`);
  }

  // To avoid awkward space between tag and ending of tag when there are no attributes
  const tagHead = [type].concat(attributes).join(' ');

  if (selfClosingTags.includes(type)) {
    return `<${tagHead}/>`;
  }

  return `<${tagHead}>${childNodes}</${type}>`;
}
