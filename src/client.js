export function connect(win, doc, helpers, name, port, sessionName) {
  const TEXT = 0;
  const NODE = 1;
  const PROPS = 2;
  const INSERT = 3;
  const REMOVE = 4;

  const ws = new WebSocket(`ws://localhost:${port}`);
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

  const placeholder = document.createElement('div');
  function getNodesFromHTML(html) {
    placeholder.innerHTML = html;

    return Array.from(placeholder.childNodes);
  }

  function patchDiff(node, target, isParent) {
    // No difference
    if (typeof node === 'undefined') {
      return;
    }

    // Remove node
    if (node === null) {
      target.remove();
      return;
    }

    // Replace node
    if (typeof node !== 'object') {
      if (target.nodeType === 3) {
        target.textContent = node;
        return;
      }

      if (isParent) {
        target.innerHTML = node;
        return;
      }

      target.outerHTML = node;
      return;
    }

    // It's a context or component
    if (node.type === 2) {
      patchDiff(node.children, target);
      return;
    }

    // Update props & children
    if (node.children && node.props) {
      patchDiff(node.children, target);
      patchProps(node.props, target);
      return;
    }

    // Update childNodes
    const currentLength = target.childNodes.length;
    Object.keys(node).forEach((key) => {
      const value = node[key];

      if (currentLength <= key) {
        if (target.nodeType === 3) {
          const normalValue = value && value.type === 1 ? value.children : value;
          const nodes = getNodesFromHTML(normalValue);

          nodes.forEach((child) => {
            target.parentElement.insertBefore(child, target);
          });
          target.remove();
          return;
        }

        target.insertAdjacentHTML('beforeend', value);
        return;
      }

      const child = target.childNodes[key];

      patchDiff(value, child);
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

  ws.onopen = () => {
    console.log('[open] Connection established');

    win.__sx = (id, e) => {
      ws.send(JSON.stringify([
        'event',
        id,
        e.type,
        syntheticEvent(e),
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

    if (type === 'update') {
      const [rawPath, diff] = data;

      if (rawPath && diff) {
        const root = getNodeByPath(document.body, rawPath);

        diff.forEach((patch) => {
          switch (patch.type) {
            case TEXT: {
              const node = getNodeByPath(root, patch.id);
              node.textContent = patch.diff;
              break;
            }

            case PROPS: {
              break;
            }

            case INSERT: {
              const id = patch.id.slice();
              const lastId = id.pop();
              const parent = getNodeByPath(root, id);

              if (parent.childNodes.length === 0) {
                parent.innerHTML = patch.diff;
                break;
              }

              const node = parent.childNodes[lastId];

              node.insertAdjacentHTML('beforebegin', patch.diff);
              break;
            }

            case REMOVE: {
              const node = getNodeByPath(root, patch.id);
              node.remove();
              break;
            }

            default: {
              break;
            }
          }
        });
      }
    }

    // Object.keys(update).forEach((key) => {
    //   document.getElementById(key).innerHTML = update[key];
    // });

    // connection.innerHTML = `data: ${event.data}`;
    // console.log(`[message] Data received from server: ${event.data}`);
  };

  ws.onclose = (event) => {
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
