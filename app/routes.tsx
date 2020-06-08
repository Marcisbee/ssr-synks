import SSR from 'ssr-synks';

import Home from './home';

export default {
  '/': () => <Home />,
  '/about': () => 'About',
  '/users/:userId': ({ userId }) => `Users ${userId}`,
  '404': () => '404 Error',
};
