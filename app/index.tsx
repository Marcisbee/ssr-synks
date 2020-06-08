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

export default function Index() {
  let router = useRoutes(routes);
  let [path] = usePath();

  return (
    <div>
      <div>
        <a href="/">Home</a>
        <a href="/about" class={path === '/about' ? 'active' : ''}>About</a>
        <a href="/users/1">Tom</a>
        <a href="/users/2">Jane</a>
      </div>
      {router}
    </div>
  );
}
