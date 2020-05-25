function connect(win, doc, helpers, name, port, session_name) {
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

      default: {
        return null;
      }
    }
  }

  ws.onopen = function (e) {
    console.log("[open] Connection established");

    win.__sx = (e) => {
      ws.send(JSON.stringify([
        'event',
        e.target.getAttribute('data-sx'),
        event.type,
        syntheticEvent(event),
      ]));
    };

    const session = win[session_name];
    const cookie = helpers.getCookie(doc.cookie, name);

    ws.send(JSON.stringify([
      'join',
      session,
      cookie,
    ]));

    // ws.send("My name is John");
  };

  ws.onmessage = function (event) {
    const [type, ...data] = JSON.parse(event.data);

    if (type === 'update') {
      const [rawPath, diff] = data;

      if (rawPath) {
        const root = doc.querySelector(`[data-sx="${rawPath}"]`);

        if (root) {
          root.outerHTML = diff;
          return;
        }

        const path = win.atob(rawPath);
        const [, parentPath, childPath] = path.match(/(.*)\.(\d+)$/, '') || [];
        if (typeof parentPath === 'undefined' || typeof childPath === 'undefined') return;

        const parent = doc.querySelector(`[data-sx="${win.btoa(parentPath)}"]`);

        if (!(parent instanceof Node)) return;

        const child = parent.childNodes[childPath];

        if (!child) return;

        // `child` is text or comment node
        child.textContent = diff;

        return;
      }

      doc.body.innerHTML = diff;
    }

    // Object.keys(update).forEach((key) => {
    //   document.getElementById(key).innerHTML = update[key];
    // });

    // connection.innerHTML = `data: ${event.data}`;
    // console.log(`[message] Data received from server: ${event.data}`);
  };

  ws.onclose = function (event) {
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

  ws.onerror = function (error) {
    ws.close();
    // connection.innerHTML = `error: ${error.message}`;
  };
}

module.exports = {
  connect,
};
