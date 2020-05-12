module.exports = {
  cookie: {
    name: 'ssr_session',
    secret: 'SSR_TIP_TOP_SECRET',
  },
  http: {
    port: 4444,
  },
  socket: {
    port: 52275,
  },
  session: {
    name: 'SSR_SESSION',
  },
}
