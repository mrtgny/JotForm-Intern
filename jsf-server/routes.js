const formStructure = require('./methods/form_structures');
const routes = require('./methods/routes');
const pages = require('./methods/pages');
const buttons = require('./methods/buttons');

formStructure.sync()
routes.sync()
pages.sync({ force: true })

module.exports = (app) => {

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the JSF API!',
  }));

  app.get("/api/routes", routes.fetchData)

  app.post("/api/routes", routes.fetchData)
  app.post("/api/routes/create", routes.create)
  app.post("/api/routes/delete", routes.deleteRecord)
  app.post("/api/routes/update", routes.update)

  app.get("/api/pages", pages.fetchData)
  app.post("/api/pages", pages.fetchData)
  app.post("/api/pages/create", pages.create)
  app.post("/api/pages/update", pages.update)

  app.post("/api/buttons", buttons.fetchData)
  app.post("/api/buttons/create", buttons.create)
  app.post("/api/buttons/update", buttons.update)
  app.post("/api/routes/delete", buttons.deleteRecord)

  app.post('/api/form_build', formStructure.create);
};