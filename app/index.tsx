import SSR from 'ssr-synks';

import routes from './routes';

function usePath(): [
  string,
  (newPath: string) => void,
] {
  const path = '/';

  return [
    path,
    (newPath) => { },
  ];
}

function useRoutes(
  routes: { [k: string]: (props) => any },
  options?: {
    basePath?: string,
  },
) {
  let [path] = usePath();

  return routes[path]({});
}

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
  render() {
    return (
      'routes'
    );
  }
}

function* Child() {
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
        <router.render />
      </div>
    );
  }
}

export default function Index() {
  return (
    <Router>
      <Child />
    </Router>
  );
  // let router = useRoutes(routes);
  // let [path] = usePath();

  // const aboutClass = {
  //   active: path === '/about',
  // };

  // return (
  //   <div>
  //     <div>
  //       <a href="/">Home</a>
  //       <a href="/about" class={cc(aboutClass)}>About</a>
  //       <a href="/users/1">Tom</a>
  //       <a href="/users/2">Jane</a>
  //     </div>
  //     {router}
  //   </div>
  // );
}
