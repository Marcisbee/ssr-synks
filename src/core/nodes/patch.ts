export class PatchVnode {
	public type: any;
	public id: any;
	public diff: any;

  constructor(type, vnode, value = null) {
    this.type = type;
    this.id = vnode && vnode.id;
    this.diff = value;
  }
}
