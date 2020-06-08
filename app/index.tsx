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

  return JSON.stringify(value);
}

export default function Index() {
  let router = useRoutes(routes);
  let [path] = usePath();

  const aboutClass = {
    active: path === '/about',
  };

  return (
    <div>
      <div>
        <a href="/">Home</a>
        <a href="/about" class={cc(aboutClass)}>About</a>
        <a href="/users/1">Tom</a>
        <a href="/users/2">Jane</a>
      </div>
      {router}
    </div>
  );
}
