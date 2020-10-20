export function connect(win, doc, helpers, name, port, sessionName) {
  const TEXT = 0;
  const NODE = 1;
  const PROPS = 2;
  const INSERT = 3;
  const REMOVE = 4;

  let isConnected = false;

  function syntheticEvent(event) {
    switch (event.type) {
      case 'click':
      case 'mousedown': {
        return {
          x: event.clientX,
          y: event.clientY,
        };
      }

      case 'input': {
        return {
          data: event.data,
          inputType: event.inputType,
          value: event.target.value,
        };
      }

      case 'submit': {
        return {
          values: Array.from(event.target).reduce(
            (acc, field) => {
              if (!field.name) {
                return acc;
              }

              return {
                ...acc,
                [field.name]: field.value,
              };
            },
            {},
          ),
        };
      }

      default: {
        return null;
      }
    }
  }

  function patchProps(props, target) {
    if (!props || typeof props !== 'object') {
      return;
    }

    Object.entries(props).forEach(([key, value]) => {
      if (value === null) {
        // Remove prop
        target.removeAttribute(key);
        return;
      }

      // Update prop
      target.setAttribute(key, value);
    });
  }

  function getNodeByPath(root, path) {
    // @TODO: Remove time and return output immediately
    // console.time('GET NODE');
    const output = path.reduce((parent, index) => {
      if (!parent || !parent.childNodes) {
        throw new Error(`Unexpected element path ${path.join('.')}`);
      }

      return parent.childNodes[index];
    }, root);
    // console.timeEnd('GET NODE');
    return output;
  }

  function patchDiff(patch, root) {
    switch (patch.type) {
      case TEXT: {
        const node = getNodeByPath(root, patch.id);
        node.textContent = patch.diff;
        return;
      }

      case PROPS: {
        const node = getNodeByPath(root, patch.id);
        patchProps(patch.diff, node);
        return;
      }

      case INSERT: {
        const id = patch.id.slice();
        const lastId = id.pop();
        const parent = getNodeByPath(root, id);

        if (parent.childNodes.length === 0) {
          parent.innerHTML = patch.diff;
          return;
        }

        const node = parent.childNodes[lastId];

        node.insertAdjacentHTML('beforebegin', patch.diff);
        return;
      }

      case REMOVE: {
        const node = getNodeByPath(root, patch.id);
        node.remove();
        return;
      }
    }
  }

  function ResyncConnect() {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.onopen = () => {
      isConnected = true;
      document.body.className = 'connected';
      console.log('[open] Connection established');

      win.onpopstate = () => {
        const url = win.location.href.replace(win.location.origin, '');
        ws.send(JSON.stringify([
          'navigate',
          url,
        ]));
      };

      win.__sx = (id, e) => {
        ws.send(JSON.stringify([
          'event',
          id,
          e.type,
          syntheticEvent(e),
        ]));
      };

      win.__sn = (e) => {
        if (isConnected) {
          e.preventDefault();
        }
        const url = e.target.href.replace(win.location.origin, '');
        win.history.pushState(undefined, document.title, url);
        ws.send(JSON.stringify([
          'navigate',
          url,
        ]));
      };

      const session = win[sessionName];
      const cookie = helpers.getCookie(doc.cookie, name);

      ws.send(JSON.stringify([
        'join',
        session,
        cookie,
      ]));

      // ws.send("My name is John");
    };

    ws.onmessage = (event) => {
      const [type, ...data] = JSON.parse(event.data);

      if (type === 'no-change') {
        return;
      }

      if (type === 'update') {
        const [rawPath, diff] = data;

        if (rawPath && diff) {
          const root = getNodeByPath(document.body, rawPath);

          diff.forEach((patch) => patchDiff(patch, root));
        }

        return;
      }

      // Object.keys(update).forEach((key) => {
      //   document.getElementById(key).innerHTML = update[key];
      // });

      // connection.innerHTML = `data: ${event.data}`;
      // console.log(`[message] Data received from server: ${event.data}`);
    };

    ws.onclose = (event) => {
      isConnected = false;
      document.body.className = '';
      // connection.innerHTML = 'close';
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');

        setTimeout(connect, 3000, win, doc, helpers, name, port);
      }
    };

    ws.onerror = () => {
      ws.close();
      // connection.innerHTML = `error: ${error.message}`;
    };
  }

  win.ResyncConnect = ResyncConnect;
}
