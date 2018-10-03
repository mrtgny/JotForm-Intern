'use strict';
const FormBuild = require('../models/form_structure').default;


module.exports = {
  create(req, res) {
    return FormBuild.create({
        record_id: req.body.dsc,
        dsc: req.body.dsc,
        data: req.body.data
      })
      .then(FormBuild => res.status(201).send(FormBuild))
      .catch(error => res.status(400).send(error));
  },
};