import { Vnode } from './generic.js';

export class ElementVnode extends Vnode {
  constructor(type, props, children) {
    super();

    this.type = type;
    this.props = props;
    this.children = children;
  }
}
