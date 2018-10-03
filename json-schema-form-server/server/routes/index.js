const formBuildController = require('../controllers/FormBuild');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the JSF API!',
  }));

  app.post('/api/form_build', formBuildController.create);
};