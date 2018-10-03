const FormStructures = require('../tables/form_structures')
const Guid = require('guid');

module.exports = {
    create(req, res) {
        
        return FormStructures.create({
            record_id: Guid.create().value,
            dsc: req.body.dsc,
            data: req.body.data
        })
            .then(FormStructures => res.status(201).send(FormStructures))
            .catch(error => res.status(400).send(error));
    },
    sync() {
        return FormStructures.sync()
    }
};