import { Vnode } from './generic.js';

export class ComponentVnode extends Vnode {
  constructor(type, props, children) {
    super();

    this.type = type;
    this.props = props;
    this.children = children;
    this.instance = null;
  }
}
