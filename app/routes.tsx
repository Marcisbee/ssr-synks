import Resync from 'resync';

import { Home } from './pages/home';
import { About } from './pages/about';

export default {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => `Users ${userId}`,
  '404': () => '404 Error',
};
