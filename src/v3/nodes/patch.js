export class PatchVnode {
  constructor(type, vnode, value = null) {
    this.type = type;
    this.vnode = vnode;
    this.id = vnode.id.join('.');
    this.diff = value;
  }
}