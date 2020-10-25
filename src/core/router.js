import { createMatcher } from './utils/route-matcher.js';

export class Router {
  constructor({ initialPath, routes } = {}) {
    this.routes = routes;
    this._setParams(initialPath);
    this.path = initialPath || '/';
  }

  _setParams(path) {
    const matcher = createMatcher(this.routes);
    const match = matcher(path);

    if (!match) {
      this.params = {};
      return;
    }

    this.key = match.key;
    this.params = match.params;
  }

  navigate(path) {
    this._setParams(path);
    this.path = path;
  }
}

export function* RouterOutlet() {
  const router = yield Router;

  while (true) {
    if (!router.key) {
      yield router.routes[404]();
    }

    yield router.routes[router.key]();
  }
}
