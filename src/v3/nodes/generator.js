import { ComponentVnode } from './component.js';

export class GeneratorVnode extends ComponentVnode {
  constructor(type, props, children) {
    super(type, props, children);

    this.iterable = null;
  }
}
