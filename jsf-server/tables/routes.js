'use strict';
const Sequelize = require("sequelize");
const sequelize = require("../config");

const Routes = sequelize.define('routes', {
    app_name: {
        type: Sequelize.STRING
    },
    record_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    parent_id: {
        type: Sequelize.STRING,
    },
    path: {
        type: Sequelize.STRING,
    },
    label: {
        type: Sequelize.STRING,
    },
    page_id: {
        type: Sequelize.STRING,
    },
    page_type: {
        type: Sequelize.STRING
    }
}, {
        schema: "jsf"
    });

module.exports = Routes