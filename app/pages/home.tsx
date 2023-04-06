import Resync from 'resync';

const { Session } = Resync;

import { Counter } from '../components/counter';
import { DefaultLayout } from '../layout/default';

export function* Home() {
  const session = yield Session;

  while (true) {
    yield (
      <DefaultLayout>
        Session: {JSON.stringify({ id: session.id.slice(0, 10) + '..' })}
        <hr/>
        <Counter />
      </DefaultLayout>
    );
  }
}
