const routes = {
  login: require('./login'),
  user: require('./user'),
};

const setup = (app) => {
  for (let route in routes)
    app.use(`/${route}`, routes[route]);
  
  return app;
}

module.exports = setup;
