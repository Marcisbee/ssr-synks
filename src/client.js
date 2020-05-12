module.exports = function connect(helpers, name, port, session_name) {
  const ws = new WebSocket(`ws://localhost:${port}`);
  const events = {};

  Object.keys(window).forEach(key => {
    if (/^on/.test(key)) {
      window.addEventListener(key.slice(2), event => {
        if (!(events[key] instanceof Array)) return;

        events[key].forEach(([el, fn]) => {
          if (el !== event.target) return;

          fn(event);
        });
      });
    }
  });

  ws.onopen = function (e) {
    console.log("[open] Connection established");

    ws.send(JSON.stringify([
      'join',
      helpers.getCookie(document.cookie, name) || window[session_name]
    ]));

    events.onclick = [
      // [increment, (e) => {
      //   console.log(e, e.target, e.target.id);
      //   ws.send(`fn:${e.target.id}`);
      // }]
    ];

    // ws.send("My name is John");
  };

  ws.onmessage = function (event) {
    const [type, value] = JSON.parse(event.data);

    if (type === 'update') {
      document.body.innerHTML = value;
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
