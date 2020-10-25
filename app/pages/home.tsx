import Resync from 'resync';

import { Counter } from '../components/counter';
import { DefaultLayout } from '../layout/default';

export function Home() {
  return (
    <DefaultLayout>
      Hello world
      <hr/>
      <Counter />
    </DefaultLayout>
  );
}
