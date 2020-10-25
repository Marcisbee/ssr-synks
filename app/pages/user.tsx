import Resync from 'resync';

import { DefaultLayout } from '../layout/default';

export function* User() {
  const router = yield Resync.Router;

  while (true) {
    yield (
      <DefaultLayout>
        USER {JSON.stringify(router.params)}
      </DefaultLayout>
    );
  }
}
