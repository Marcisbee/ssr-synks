export class PatchVnode {
  constructor(type, vnode, value = null) {
    this.type = type;
    this.id = vnode && vnode.id;
    this.diff = value;
  }
}
