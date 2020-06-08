import SSR from 'ssr-synks';

import routes from './routes';

function useRoutes(routes) {
  return routes['/']();
}

export default function Index() {
  let router = useRoutes(routes);

  return (
    <div>
      <div>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/users/1">Tom</a>
        <a href="/users/2">Jane</a>
      </div>
      {router}
    </div>
  );
}
