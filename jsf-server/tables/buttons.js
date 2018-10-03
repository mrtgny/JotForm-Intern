'use strict';
const Sequelize = require("sequelize");
const sequelize = require("../config");

const Buttons = sequelize.define('buttons', {
    app_name: {
        type: Sequelize.STRING
    },
    record_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    button_type: {
        type: Sequelize.STRING
    },
    
}, {
        schema: "jsf"
    });

module.exports = Buttons