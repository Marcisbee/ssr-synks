import { Vnode } from './generic.js';

export class TextVnode extends Vnode {
  constructor(value) {
    super();

    this.value = value;
  }
}
