module.exports = function connect(win, doc, helpers, name, port, session_name) {
  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.onopen = function (e) {
    console.log("[open] Connection established");

    win.__sx = (e) => {
      ws.send(JSON.stringify([
        'event',
        e.target.getAttribute('data-sx'),
        `on${event.type}`,
        {
          x: e.clientX,
          y: e.clientY,
        }
      ]));
    };

    ws.send(JSON.stringify([
      'join',
      helpers.getCookie(doc.cookie, name) || win[session_name]
    ]));

    // ws.send("My name is John");
  };

  ws.onmessage = function (event) {
    const [type, ...data] = JSON.parse(event.data);

    if (type === 'update') {
      const [path, diff] = data;

      if (path) {
        const root = doc.querySelector(`[data-sx="${path}"]`);

        if (root) {
          root.outerHTML = diff;
        }

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

      setTimeout(connect, 3000, helpers, name, port);
    }
  };

  ws.onerror = function (error) {
    // connection.innerHTML = `error: ${error.message}`;
  };
}
