const Buttons = require('../tables/buttons')
const Guid = require('guid');

module.exports = {
    create(req, res) {
        console.log("___***REQ***___", req);
        return Buttons.create({
            app_name: "jsf",
            record_id: Guid.create().value,
            ...req.body
        })
            .then(Buttons => res.status(201).send(Buttons))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        const { record_id, ...rest } = req.body

        return Buttons.update({
            ...rest
        }, {
                where: {
                    record_id
                }
            }).then(Buttons => res.status(201).send(Buttons))
            .catch(error => res.status(400).send(error));
    },
    deleteRecord(req, res) {
        console.log("___***REQ***___", req);
        return Buttons.destroy({
            where: {
                ...req.body
            }
        }).then(Buttons => res.sendStatus(201))
            .catch(error => res.status(400).send(error));

    },
    fetchData(req, res) {
        const params = {
            attributes: ["record_id", "parent_id", "page_id", "path", "label", "page_type"],
        }

        if (req.body)
            params.where = { ...(params.where || {}), ...req.body }
        params.order = ["label"]

        return Buttons.findAll(params)
            .then(Buttons => res.status(201).send(Buttons))
            .catch(error => res.status(400).send(error));
    },
    sync() {
        return Buttons.sync()
    }
};