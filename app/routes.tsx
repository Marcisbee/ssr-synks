import Resync from 'resync';

import { Home } from './pages/home';
import { DefaultLayout } from './layout/default';

export default {
  '/': () => <Home />,
  '/about': () => <DefaultLayout>AboutHTML</DefaultLayout>,
  '/users/:userId': ({ userId }) => `Users ${userId}`,
  '404': () => '404 Error',
};
