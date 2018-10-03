'use strict';
const Sequelize = require("sequelize");
const sequelize = require("../config");

const FormStructures = sequelize.define('form_structures', {
    record_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    dsc: {
        type: Sequelize.STRING
    },
    data: {
        type: Sequelize.JSONB
    }
}, {
        schema: "jsf"
    });

module.exports = FormStructures