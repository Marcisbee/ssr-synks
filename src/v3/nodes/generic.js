export class Vnode {
  constructor() {
    /** @type {number[]} */
    this.id = [];
  }

  unsubscribe() {
    const children = this.instance || this.children;

    if (!children) return;

    [].concat(children).forEach((child) => {
      if (!(child instanceof Vnode)) return;

      child.unsubscribe();
    });
  }

  // clone() {
  //   const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);

  //   if (clone.name === 'ComponentVnode') {
  //     clone.instance = null;
  //   }

  //   if (clone.name === 'GeneratorVnode') {
  //     clone.iterable = null;
  //   }

  //   if (clone.children && clone.children.length > 0) {
  //     clone.children = clone.children.map((item) => item.clone());
  //   }

  //   return clone;
  // }
}
