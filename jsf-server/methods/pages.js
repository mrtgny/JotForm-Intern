const Pages = require('../tables/pages')
const Guid = require('guid');

module.exports = {
    create(req, res) {
        console.log("___***REQ***___", req);
        return Pages.create({
            app_name: "jsf",
            record_id: Guid.create().value,
            ...req.body
        })
            .then(Pages => res.status(201).send(Pages))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        return Pages.find({
            where: {
                app_name: "jsf"
            }
        }).then((pages) => {
            if (pages)
                pages.updateAttributes({
                    ...req.body
                }).then(Pages => res.status(201).send(Pages))
                    .catch(error => res.status(400).send(error));
        })
    },
    fetchData(req, res) {
        const params = {
            attributes: ["app_name", "data", "record_id"],
            order: ["data"]
        }
        if (req.body)
            params.where = { ...req.body }

        return Pages.findAll(params)
            .then(Pages => res.status(201).send(Pages))
            .catch(error => res.status(400).send(error));
    },
    sync() {
        return Pages.sync()
    }
};