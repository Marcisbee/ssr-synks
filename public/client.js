(function connect() {
  const ws = new WebSocket("ws://localhost:52275");

  const events = {};

  function getCookie(/* name */) {
    // return (
    //   document.cookie.match(
    //     new RegExp(`${name}=([^; |$]+)`)
    //   ) || []
    // )[1];
    return (document.cookie.match(/ssr_session=([^; |$]+)/) || [])[1];
  }

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
    console.log("Sending to server");

    ws.send(`s1:${getCookie()}`);

    events.onclick = [
      // [increment, (e) => {
      //   console.log(e, e.target, e.target.id);
      //   ws.send(`fn:${e.target.id}`);
      // }]
    ];

    // ws.send("My name is John");
  };

  ws.onmessage = function (event) {
    const update = JSON.parse(event.data);

    if (update.t === 'u') {
      document.body.innerHTML = update.p;
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

      setTimeout(connect, 3000);
    }
  };

  ws.onerror = function (error) {
    // connection.innerHTML = `error: ${error.message}`;
    console.error(error);
    console.error(`[error] ${error.message}`);
  };
})();
