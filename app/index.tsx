import Resync from 'resync';

import routes from './routes';
import { CounterContext } from './counter';

function cc(value) {
  if (Array.isArray(value)) {
    return value
      .map(cc)
      .filter((a) => !!a);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => val && cc(key))
      .filter((a) => !!a);
  }

  if (!value) {
    return null;
  }

  return String(value);
}

class Router {
  path = '/';

  navigate(path) {
    this.path = path;
  }

  outlet = ({ routes }) => {
    const route = routes[this.path];

    if (!route) {
      return null;
    }

    return Resync.h(route);
  }
}

function* RouterOutlet({ routes }) {
  const router = yield Router;

  while (true) {
    const route = routes[router.path];

    if (!route) {
      yield null;
    } else {
      yield Resync.h(route);
    }
  }
}

function* App() {
  const router = yield Router;

  const aboutClass = {
    active: router.path === '/about',
  };

  while (true) {
    yield (
      <div>
        <div>
          <a onclick={() => router.navigate('/')}>Home</a>
          <a onclick={() => router.navigate('/about')} class={cc(aboutClass)}>About</a>
          <a href="/users/1">Tom</a>
          <a href="/users/2">Jane</a>
        </div>
        <CounterContext>
          <RouterOutlet routes={routes} />
        </CounterContext>
      </div>
    );
  }
}

export default function Index() {
  return (
    <Router>
      <App />
    </Router>
  );
}
