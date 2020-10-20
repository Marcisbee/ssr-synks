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

function* App() {
  const router = yield Resync.Router;

  const aboutClass = {
    active: router.path === '/about',
  };

  function onClick(event) {
    console.log(event, 'runs on server');
  }

  onClick.client = function () {
    console.log(this, 'runs on client');
  }

  while (true) {
    const props = {}
    if (router.path === '/about') {
      props.class = 'cool-class';
    }
    yield (
      <div>
        <div class="pagination">
          <a href="/">Home</a>
          <a href="/about" {...props}>About</a>
          <a href="/users/1">Tom</a>
          <a href="/users/2">Jane</a>
        </div>
        <CounterContext>
          <Resync.RouterOutlet routes={routes} />
        </CounterContext>
      </div>
    );
  }
}

export default function Index() {
  return (
    <div id="app">
      <App />
    </div>
  );
}
