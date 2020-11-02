import { ComponentVnode } from './component.js';

export class GeneratorVnode extends ComponentVnode {
	public iterable: any;
	public subscribed: any;
	public isUnsubscribed: any;

  constructor(type, props, children) {
    super(type, props, children);

    this.iterable = null;
    this.subscribed = [];
    this.isUnsubscribed = false;
  }

  unsubscribe() {
    if (this.subscribed) {
      this.isUnsubscribed = true;
      this.subscribed.slice().forEach((unsubscribe) => unsubscribe());
    }

    super.unsubscribe();
  }
}
