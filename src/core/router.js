import { createMatcher } from './utils/route-matcher.js';

export class Router {
  constructor({ initialPath } = {}) {
    this.path = initialPath || '/';
  }

  navigate(path) {
    this.path = path;
  }
}

export function* RouterOutlet({ routes }) {
  const matcher = createMatcher(routes);
  const router = yield Router;

  while (true) {
    const route = matcher(router.path);

    if (!route) {
      yield routes[404]();
    } else {
      yield routes[route.key](route.params);
    }
  }
}
