'use strict';
const Sequelize = require("sequelize");
const sequelize = require("../config");

const Pages = sequelize.define('pages', {
    app_name: {
        type: Sequelize.STRING,
    },
    record_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    data: {
        type: Sequelize.JSONB
    }
}, {
        schema: "jsf"
    });

module.exports = Pages