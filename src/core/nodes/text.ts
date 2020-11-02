import { Vnode } from './generic.js';

export class TextVnode extends Vnode {
	public value: any;

  constructor(value) {
    super();

    this.value = value;
  }
}
