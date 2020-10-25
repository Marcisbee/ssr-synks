import Resync from 'resync';

import { Counter } from '../components/counter';
import { DefaultLayout } from '../layout/default';

export function* Home() {
  const session = yield Resync.Session;

  while (true) {
    yield (
      <DefaultLayout>
        Hello world "{JSON.stringify(session)}"
        <hr/>
        <Counter />
      </DefaultLayout>
    );
  }
}
