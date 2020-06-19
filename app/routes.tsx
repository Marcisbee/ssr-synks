import Resync from 'resync';

// import Home from './home';
import { Counter } from './counter';

export default {
  '/': () => <Counter />,
  '/about': () => 'About',
  '/users/:userId': ({ userId }) => `Users ${userId}`,
  '404': () => '404 Error',
};
