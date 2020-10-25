import Resync from 'resync';

import { Home } from './pages/home';
import { About } from './pages/about';
import { User } from './pages/user';

export default {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': () => <User />,
  '404': () => '404 Error',
};
