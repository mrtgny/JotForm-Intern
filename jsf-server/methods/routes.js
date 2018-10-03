const Routes = require('../tables/routes')
const Guid = require('guid');

module.exports = {
    create(req, res) {
        console.log("___***REQ***___", req);
        return Routes.create({
            app_name: "jsf",
            record_id: Guid.create().value,
            ...req.body
        })
            .then(Routes => res.status(201).send(Routes))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        const { record_id, ...rest } = req.body

        return Routes.update({
            ...rest
        }, {
                where: {
                    record_id
                }
            }).then(Routes => res.status(201).send(Routes))
            .catch(error => res.status(400).send(error));
    },
    deleteRecord(req, res) {
        console.log("___***REQ***___", req);
        return Routes.destroy({
            where: {
                ...req.body
            }
        }).then(Routes => res.sendStatus(201))
            .catch(error => res.status(400).send(error));

    },
    fetchData(req, res) {
        const params = {
            attributes: ["record_id", "parent_id", "page_id", "path", "label", "page_type"],
        }

        if (req.body)
            params.where = { ...(params.where || {}), ...req.body }
        params.order = ["label"]

        return Routes.findAll(params)
            .then(Routes => res.status(201).send(Routes))
            .catch(error => res.status(400).send(error));
    },
    sync() {
        return Routes.sync()
    }
};