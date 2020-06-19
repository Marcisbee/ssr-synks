import SSR from 'ssr-synks';

// import Home from './home';
import { Test } from './test';

export default {
  '/': () => <Test />,
  '/about': () => 'About',
  '/users/:userId': ({ userId }) => `Users ${userId}`,
  '404': () => '404 Error',
};
